import {
	addMeltEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	generateIds,
	isHTMLElement,
	isHidden,
	isLetter,
	kbd,
	omit,
	overridable,
	styleToString,
	toWritableStores,
	withGet,
} from '$lib/internal/helpers';
import type { Defaults, MeltActionReturn } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';

import type { TreeEvents } from './events';
import type { CreateTreeViewProps, TreeParts } from './types';

const defaults = {
	forceVisible: false,
	defaultExpanded: [] as string[],
	multiple: false,
} satisfies Defaults<CreateTreeViewProps>;

const { name } = createElHelpers<TreeParts>('tree-view');

const treeIdParts = ['tree'] as const;
export type TreeIdParts = typeof treeIdParts;

export function createTreeView(args?: CreateTreeViewProps) {
	const withDefaults = { ...defaults, ...args } satisfies CreateTreeViewProps;

	const options = toWritableStores(omit(withDefaults, 'expanded', 'ids'));
	const { forceVisible, multiple } = options;

	const expandedWritable = withDefaults.expanded ?? writable(withDefaults.defaultExpanded);
	const expanded = withGet(overridable(expandedWritable, withDefaults?.onExpandedChange));

	const ids = toWritableStores({ ...generateIds(treeIdParts), ...withDefaults.ids });

	/**
	 * The ids of the selected items.
	 */
	const selected = withGet(writable([] as string[]));

	/**
	 * The id of the first selected item, or `null` if none are selected.
	 */
	const firstSelected = withGet(
		derived(selected, ($selected) => {
			if ($selected.length === 0) return null;
			return $selected[0];
		})
	);

	/**
	 * Determines if the tree view item is selected.
	 * This is useful for displaying additional markup.
	 */
	const isSelected = withGet(
		derived(selected, ($selected) => {
			return (itemId: string) => $selected.includes(itemId);
		})
	);

	/**
	 * Determines if a tree view item is collapsed or not.
	 * This is useful for displaying additional markup or using Svelte transitions
	 * on the group item.
	 */
	const isExpanded = withGet(
		derived(expanded, ($expanded) => {
			return (itemId: string) => $expanded.includes(itemId);
		})
	);

	const rootTree = builder(name(), {
		stores: ids.tree,
		returned: (id) => {
			return {
				role: 'tree',
				id,
			} as const;
		},
	});

	const item = builder(name('item'), {
		stores: [expanded, selected],
		returned: ([$expanded, $selected]) => {
			let firstItem = true;
			return (opts: { id: string; hasChildren?: boolean }) => {
				// Have some default options that can be passed to the create()
				const { id, hasChildren } = opts;

				let tabindex: 0 | -1;
				if ($selected.length > 0) {
					// Focus the first selected item
					tabindex = id === $selected[0] ? 0 : -1;
				} else {
					// Focus the first item
					tabindex = firstItem ? 0 : -1;
				}

				firstItem = false;

				return {
					role: 'treeitem',
					id,
					tabindex,
					'aria-selected': $selected.includes(id),
					'aria-expanded': hasChildren ? $expanded.includes(id) : undefined,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<TreeEvents['item']> => {
			let isSpaceOrEnter = false;

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					const { key } = e;

					const keyIsLetter = isLetter(key);

					const keys = [
						kbd.ARROW_DOWN,
						kbd.ARROW_UP,
						kbd.ARROW_LEFT,
						kbd.ARROW_RIGHT,
						kbd.ENTER,
						kbd.SPACE,
						kbd.END,
						kbd.HOME,
					] as const;

					if (!keys.includes(key) && !keyIsLetter) {
						return;
					}

					const rootEl = document.getElementById(ids.tree.get());
					if (!rootEl || !isTreeItem(node)) {
						return;
					}

					const items = getItems();
					const nodeIdx = items.findIndex((item) => item === node);

					if (key !== kbd.ENTER && key !== kbd.SPACE) {
						e.preventDefault();
					}

					if (key === kbd.ENTER || key === kbd.SPACE) {
						// Select el
						handleSelection(node);
						isSpaceOrEnter = true;
					} else if (key === kbd.ARROW_DOWN && nodeIdx !== items.length - 1) {
						// Focus next el
						items[nodeIdx + 1]?.focus();
					} else if (key === kbd.ARROW_UP && nodeIdx !== 0) {
						// Focus previous el
						items[nodeIdx - 1]?.focus();
					} else if (key === kbd.HOME && nodeIdx !== 0) {
						// Focus first el
						items[0]?.focus();
					} else if (key === kbd.END && nodeIdx != items.length - 1) {
						// Focus last el
						items.at(-1)?.focus();
					} else if (key === kbd.ARROW_LEFT) {
						if (elementIsExpanded(node)) {
							// Collapse group
							toggleChildrenElements(node);
						} else {
							// Focus parent group
							const parentGroup = node?.closest('[role="group"]');
							const groupId = parentGroup?.id;
							const item = items.find((item) => item.id === groupId);
							item?.focus();
						}
					} else if (key === kbd.ARROW_RIGHT) {
						if (elementIsExpanded(node)) {
							// Focus first child
							items[nodeIdx + 1]?.focus();
						} else if (elementHasChildren(node)) {
							// Expand group
							toggleChildrenElements(node);
						}
					} else if (keyIsLetter) {
						focusItemStartingWith(key, items, nodeIdx);
					}
				}),
				addMeltEventListener(node, 'click', () => {
					node.focus();
					if (!isSpaceOrEnter) {
						// The keydown event already selected the element.
						// Don't select it again to prevent toggling back
						// to the same state in multi select mode.
						handleSelection(node);
						toggleChildrenElements(node);
					}
					isSpaceOrEnter = false;
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const group = builder(name('group'), {
		stores: [expanded, forceVisible],
		returned: ([$expanded, $forceVisible]) => {
			return (opts: { id: string }) => {
				const { id } = opts;
				const hidden = !$forceVisible && !$expanded.includes(id);
				return {
					role: 'group',
					id,
					hidden: hidden ? true : undefined,
					style: styleToString({
						display: hidden ? 'none' : undefined,
					}),
				} as const;
			};
		},
	});

	function handleSelection(el: HTMLElement) {
		if (!el.id) return;

		if (multiple.get()) {
			toggleSelection(el);
		} else if (firstSelected.get() !== el.id) {
			selected.set([el.id]);
		}
	}

	function toggleSelection(el: HTMLElement) {
		if (elementIsSelected(el)) {
			selected.update((prev) => prev.filter((id) => id !== el.id));
		} else {
			selected.update((prev) => [...prev, el.id]);
		}
	}

	function getItems(): HTMLElement[] {
		const rootEl = document.getElementById(ids.tree.get());
		if (!rootEl) return [];

		// Select all 'treeitem' li elements within our root element.
		return Array.from(rootEl.querySelectorAll('[role="treeitem"]')).filter(
			(el): el is HTMLElement => isHTMLElement(el) && !isHidden(el)
		);
	}

	function focusItemStartingWith(letter: string, items: HTMLElement[], nodeIdx: number) {
		// Check whether a value with the letter exists
		// after the current focused element and focus it,
		// if it does exist. If it does not exist, we check
		// previous values.
		let nextFocusIdx: number | null = null;

		// Check elements after currently focused one.
		for (let i = nodeIdx + 1; i < items.length; ++i) {
			if (localeStartsWith(items[i], letter)) {
				nextFocusIdx = i;
				break;
			}
		}

		if (nextFocusIdx === null) {
			// Check elements before currently focused one,
			// if no index has been found yet.
			for (let i = 0; i < nodeIdx; ++i) {
				if (localeStartsWith(items[i], letter)) {
					nextFocusIdx = i;
					break;
				}
			}
		}

		if (nextFocusIdx !== null) {
			const item = items[nextFocusIdx];
			if (!item.id) return;
			item.focus();
		}
	}

	const collator = Intl.Collator(undefined, {
		usage: 'search',
		sensitivity: 'base',
	});

	function localeStartsWith(item: HTMLElement, letter: string) {
		const itemLetter = item.textContent?.trimStart()?.[0];
		if (!itemLetter) return false;
		return collator.compare(itemLetter, letter) === 0;
	}

	function toggleChildrenElements(el: HTMLElement) {
		if (!elementHasChildren(el) || !el.id) return;

		if (elementIsExpanded(el)) {
			expanded.update((prev) => prev.filter((id) => id !== el.id));
		} else {
			expanded.update((prev) => [...prev, el.id]);
		}
	}

	function isTreeItem(el: HTMLElement) {
		return el.role === 'treeitem';
	}

	function elementHasChildren(el: HTMLElement) {
		return el.hasAttribute('aria-expanded');
	}

	function elementIsExpanded(el: HTMLElement) {
		return el.ariaExpanded === 'true';
	}

	function elementIsSelected(el: HTMLElement) {
		return el.ariaSelected === 'true';
	}

	return {
		ids,
		elements: {
			tree: rootTree,
			item,
			group,
		},
		states: {
			expanded,
			selected,
			firstSelected,
		},
		options,
		helpers: {
			isExpanded,
			isSelected,
		},
	};
}
