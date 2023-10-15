import {
	addMeltEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	generateId,
	getElementByMeltId,
	isHTMLElement,
	isHidden,
	isLetter,
	kbd,
	last,
	overridable,
	styleToString,
} from '$lib/internal/helpers';
import type { Defaults, MeltActionReturn } from '$lib/internal/types';
import { derived, writable, type Writable } from 'svelte/store';

import type { TreeEvents } from './events';
import type { CreateTreeViewProps, TreeParts } from './types';

const defaults = {
	forceVisible: false,
	defaultExpanded: [] as string[],
} satisfies Defaults<CreateTreeViewProps>;

const ATTRS = {
	TABINDEX: 'tabindex',
	EXPANDED: 'aria-expanded',
	LABELLEDBY: 'aria-labelledby',
	DATAID: 'data-id',
};

const { name } = createElHelpers<TreeParts>('tree-view');

export function createTreeView(args?: CreateTreeViewProps) {
	const withDefaults = { ...defaults, ...args };
	const { forceVisible } = withDefaults;

	/**
	 * Track currently focused item in the tree.
	 */
	const lastFocusedId: Writable<string | null> = writable(null);
	const selectedItem: Writable<HTMLElement | null> = writable(null);

	const expandedWritable = withDefaults.expanded ?? writable(withDefaults.defaultExpanded);
	const expanded = overridable(expandedWritable, withDefaults?.onExpandedChange);

	const selectedId = derived([selectedItem], ([$selectedItem]) => {
		return $selectedItem?.getAttribute('data-id');
	});

	/**
	 * Determines if the tree view item is selected.
	 * This is useful for displaying additional markup.
	 */
	const isSelected = derived([selectedItem], ([$value]) => {
		return (itemId: string) => $value?.getAttribute('data-id') === itemId;
	});

	/**
	 * Determines if a tree view item is collapsed or not.
	 * This is useful for displaying additional markup or using Svelte transitions
	 * on the group item.
	 */
	const isExpanded = derived([expanded], ([$expanded]) => {
		return (itemId: string) => $expanded.includes(itemId);
	});

	const ids = {
		tree: generateId(),
	};

	const rootTree = builder(name(), {
		returned: () => {
			return {
				role: 'tree',
				'data-melt-id': ids.tree,
			} as const;
		},
	});

	let isKeydown = false;
	const item = builder(name('item'), {
		stores: [expanded, selectedId, lastFocusedId],
		returned: ([$expanded, $selectedId, $lastFocusedId]) => {
			return (opts: { id: string; hasChildren?: boolean }) => {
				// Have some default options that can be passed to the create()
				const { id, hasChildren } = opts;

				let tabindex = 0;
				if ($lastFocusedId !== null) {
					tabindex = $lastFocusedId === id ? 0 : -1;
				}
				return {
					role: 'treeitem',
					'aria-selected': $selectedId === id,
					'data-id': id,
					tabindex,
					'aria-expanded': hasChildren ? $expanded.includes(id) : undefined,
				};
			};
		},
		action: (node: HTMLElement): MeltActionReturn<TreeEvents['item']> => {
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
						kbd.ASTERISK,
					] as const;

					if (!keys.includes(key) && !keyIsLetter) {
						return;
					}

					const rootEl = getElementByMeltId(ids.tree);
					if (!rootEl || !isHTMLElement(node) || node.getAttribute('role') !== 'treeitem') {
						return;
					}

					const items = getItems();
					const nodeIdx = items.findIndex((item) => item === node);

					if (key !== kbd.ENTER && key !== kbd.SPACE) {
						e.preventDefault();
					}

					if (key === kbd.ENTER || key === kbd.SPACE) {
						// Select el
						updateSelectedElement(node);
						isKeydown = true;
					} else if (key === kbd.ARROW_DOWN && nodeIdx !== items.length - 1) {
						// Focus next el
						const nextItem = items[nodeIdx + 1];
						if (!nextItem) return;
						setFocusedItem(nextItem);
					} else if (key === kbd.ARROW_UP && nodeIdx !== 0) {
						// Focus previous el
						const prevItem = items[nodeIdx - 1];
						if (!prevItem) return;
						setFocusedItem(prevItem);
					} else if (key === kbd.HOME && nodeIdx !== 0) {
						// Focus first el
						const item = items[0];
						if (!item) return;
						setFocusedItem(item);
					} else if (key === kbd.END && nodeIdx != items.length - 1) {
						// Focus last el
						const item = last(items);
						if (!item) return;
						setFocusedItem(item);
					} else if (key === kbd.ARROW_LEFT) {
						if (elementIsExpanded(node)) {
							// Collapse group
							toggleChildrenElements(node);
						} else {
							// Focus parent group
							const parentGroup = node?.closest('[role="group"]');
							const groupId = parentGroup?.getAttribute('data-group-id');
							const item = items.find((item) => item.getAttribute('data-id') === groupId);
							if (!item) return;
							setFocusedItem(item as HTMLElement);
						}
					} else if (key === kbd.ARROW_RIGHT) {
						if (elementIsExpanded(node)) {
							// Focus first child
							const nextItem = items[nodeIdx + 1];
							if (!nextItem) return;
							setFocusedItem(nextItem);
						} else if (elementHasChildren(node)) {
							// Expand group
							toggleChildrenElements(node);
						}
					} else if (keyIsLetter) {
						/**
						 * Check whether a value with the letter exists
						 * after the current focused element and focus it,
						 * if it does exist. If it does not exist, we check
						 * previous values.
						 */
						const values = items.map((item) => {
							return {
								value: item.textContent?.toLowerCase().trim(),
								id: item.getAttribute('data-id'),
							};
						});

						let nextFocusIdx = -1;

						// Check elements after currently focused one.
						let foundNextFocusable = values.slice(nodeIdx + 1).some((item, i) => {
							if (item.value?.toLowerCase()[0] === key) {
								nextFocusIdx = nodeIdx + 1 + i;
								return true;
							}

							return false;
						});

						if (!foundNextFocusable) {
							/**
							 * Check elements before currently focused one,
							 * if no index has been found yet.
							 * */
							foundNextFocusable = values.slice(0, nodeIdx).some((item, i) => {
								if (item.value?.toLowerCase().at(0) === key) {
									nextFocusIdx = i;
									return true;
								}

								return false;
							});
						}

						if (foundNextFocusable && values[nextFocusIdx].id) {
							const nextFocusEl = items[nextFocusIdx];
							if (!nextFocusEl) return;
							setFocusedItem(nextFocusEl);
						}
					}
				}),
				addMeltEventListener(node, 'click', async () => {
					updateSelectedElement(node);
					setFocusedItem(node);
					if (!isKeydown) {
						toggleChildrenElements(node);
					}
					isKeydown = false;
				}),
				addMeltEventListener(node, 'focus', () => {
					lastFocusedId.update((p) => node.getAttribute('data-id') ?? p);
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
		stores: [expanded],
		returned: ([$expanded]) => {
			return (opts: { id: string }) => ({
				role: 'group',
				'data-group-id': opts.id,
				hidden: !forceVisible && !$expanded.includes(opts.id) ? true : undefined,
				style: styleToString({
					display: !forceVisible && !$expanded.includes(opts.id) ? 'none' : undefined,
				}),
			});
		},
	});

	function setFocusedItem(el: HTMLElement) {
		lastFocusedId.update((p) => el.getAttribute('data-id') ?? p);
		el.focus();
	}

	function updateSelectedElement(el: HTMLElement) {
		const id = el.getAttribute(ATTRS.DATAID);
		if (!id) return;

		selectedItem.set(el);
	}

	function getItems(): HTMLElement[] {
		let items = [] as HTMLElement[];
		const rootEl = getElementByMeltId(ids.tree);
		if (!rootEl) return items;

		// Select all 'treeitem' li elements within our root element.
		items = Array.from(rootEl.querySelectorAll('[role="treeitem"]')).filter(
			(el) => !isHidden(el as HTMLElement)
		) as HTMLElement[];

		return items;
	}

	function getElementAttributes(el: HTMLElement) {
		const hasChildren = el.hasAttribute(ATTRS.EXPANDED);
		const expanded = el.getAttribute(ATTRS.EXPANDED);
		const dataId = el.getAttribute(ATTRS.DATAID);

		return {
			hasChildren,
			expanded,
			dataId,
		};
	}

	function toggleChildrenElements(el: HTMLElement) {
		const { hasChildren, expanded: expandedAttr, dataId } = getElementAttributes(el);
		if (!hasChildren || expandedAttr === null || dataId === null) return;

		if (expandedAttr === 'false') {
			expanded.update((prev) => [...prev, dataId]);
		} else {
			expanded.update((prev) => prev.filter((item) => item !== dataId));
		}
	}

	function elementHasChildren(el: HTMLElement) {
		return el.hasAttribute(ATTRS.EXPANDED);
	}

	function elementIsExpanded(el: HTMLElement) {
		return el.getAttribute(ATTRS.EXPANDED) === 'true';
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
			selectedItem,
		},
		helpers: {
			isExpanded,
			isSelected,
		},
	};
}
