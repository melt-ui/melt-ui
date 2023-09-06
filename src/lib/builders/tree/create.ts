import {
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateId,
	getElementByMeltId,
	isBrowser,
	isHTMLElement,
	isLetter,
	kbd,
	last,
	styleToString,
} from '$lib/internal/helpers';
import type { Defaults, MeltActionReturn } from '$lib/internal/types';
import { derived, writable, type Writable } from 'svelte/store';

import type { TreeEvents } from './events';
import type { CreateTreeViewProps, TreeParts } from './types';

const defaults = {
	forceVisible: false,
} satisfies Defaults<CreateTreeViewProps>;

const ATTRS = {
	TABINDEX: 'tabindex',
	EXPANDED: 'aria-expanded',
	LABELLEDBY: 'aria-labelledby',
	DATAID: 'data-id',
};

const { name } = createElHelpers<TreeParts>('tree-view');

export function createTreeView(args: CreateTreeViewProps) {
	const argsWithDefaults = { ...defaults, ...args };
	const { forceVisible } = argsWithDefaults;

	/**
	 * Track currently focused item in the tree.
	 */
	const lastFocusedId: Writable<string | null> = writable(null);
	const selectedItem: Writable<HTMLElement | null> = writable(null);
	const collapsedGroups: Writable<string[]> = writable([]);

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
	const isCollapsedGroup = derived([collapsedGroups], ([$collapsedGroups]) => {
		return (itemId: string) => $collapsedGroups.includes(itemId);
	});

	const rootIds = {
		tree: generateId(),
		label: generateId(),
	};

	const rootTree = builder(name(), {
		returned: () => {
			return {
				role: 'tree',
				'aria-labelledby': rootIds.label,
				'data-melt-id': rootIds.tree,
			} as const;
		},
	});

	const label = builder(name('label'), {
		returned: () => ({
			id: rootIds.label,
		}),
	});

	let hasActiveTabIndex = false;
	effect(selectedItem, ($selectedItem) => {
		if (!$selectedItem) {
			hasActiveTabIndex = false;
		} else {
			hasActiveTabIndex = true;
		}
	});

	const item = builder(name('item'), {
		stores: [collapsedGroups, selectedId, lastFocusedId],
		returned: ([$collapsedGroups, $selectedId, $lastFocusedId]) => {
			return (opts: { value: string; id: string; hasChildren: boolean }) => {
				// Have some default options that can be passed to the create()
				const { value, id, hasChildren } = opts;

				let tabindex = -1;
				if (!hasActiveTabIndex) {
					tabindex = 0;
				} else if ($selectedId) {
					tabindex = $selectedId === id ? 0 : -1;
				} else {
					tabindex = $lastFocusedId === id ? 0 : -1;
				}

				hasActiveTabIndex = true;

				return {
					role: 'treeitem',
					'aria-selected': $selectedId === id,
					'data-id': id,
					'data-value': value,
					tabindex,
					'aria-expanded': hasChildren ? !$collapsedGroups.includes(id) : undefined,
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

					const rootEl = getElementByMeltId(rootIds.tree);
					if (!rootEl || !isHTMLElement(node) || node.getAttribute('role') !== 'treeitem') {
						return;
					}

					const items = getItems();
					const nodeIdx = items.findIndex((item) => item === node);

					// Prevent other tree events from also firing the event.
					e.stopPropagation();

					if (key !== kbd.ENTER && key !== kbd.SPACE) {
						e.preventDefault();
					}

					if (key === kbd.ENTER || key === kbd.SPACE) {
						// Select el
						updateSelectedElement(node);
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
						const values = items.map((item) => ({
							value: item.getAttribute('data-value'),
							id: item.getAttribute('data-id'),
						}));

						let nextFocusIdx = -1;

						// Check elements after currently focused one.
						let foundNextFocusable = values.slice(nodeIdx + 1).some((item, i) => {
							if (item.value?.toLowerCase().at(0) === key) {
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
				addMeltEventListener(node, 'click', async (e) => {
					e.stopPropagation();
					updateSelectedElement(node);
					setFocusedItem(node);
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
		stores: [collapsedGroups],
		returned: ([$collapsedGroups]) => {
			return (opts: { id: string }) => ({
				role: 'group',
				'data-group-id': opts.id,
				hidden: !forceVisible && isBrowser && $collapsedGroups.includes(opts.id) ? true : undefined,
				style: styleToString({
					display: !forceVisible && $collapsedGroups.includes(opts.id) ? 'none' : undefined,
				}),
			});
		},
	});

	function setFocusedItem(el: HTMLElement) {
		lastFocusedId.set(el.getAttribute('data-id'));
		el.focus();
	}

	function updateSelectedElement(el: HTMLElement) {
		const id = el.getAttribute(ATTRS.DATAID);
		if (!id) return;

		selectedItem.set(el);
	}

	function getItems(): HTMLElement[] {
		let items = [] as HTMLElement[];
		const rootEl = getElementByMeltId(rootIds.tree);
		if (!rootEl) return items;

		// Select all 'treeitem' li elements within our root element.
		items = Array.from(rootEl.querySelectorAll('[role="treeitem"]'));

		/**
		 * Filter out all elements that have parents that are not expanded.
		 */
		const closedParents = Array.from(rootEl.querySelectorAll('[aria-expanded="false"]'));
		items = items.filter(
			(item) => !closedParents.some((parent) => item !== parent && parent.contains(item))
		);

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
		const { hasChildren, expanded, dataId } = getElementAttributes(el);
		if (!hasChildren || expanded === null || dataId === null) return;

		if (expanded === 'false') {
			collapsedGroups.update((prev) => prev.filter((item) => item !== dataId));
		} else {
			collapsedGroups.update((prev) => [...prev, dataId]);
		}
	}

	function elementHasChildren(el: HTMLElement) {
		return el.hasAttribute(ATTRS.EXPANDED);
	}

	function elementIsExpanded(el: HTMLElement) {
		return el.getAttribute(ATTRS.EXPANDED) === 'true';
	}

	return {
		elements: {
			tree: rootTree,
			label,
			item,
			group,
		},
		states: {
			collapsedGroups,
			selectedItem,
		},
		helpers: {
			isCollapsedGroup,
			isSelected,
		},
	};
}
