import { get, writable, type Writable } from 'svelte/store';
import type { Defaults } from "$lib/internal/types";
import {
    addEventListener,
    builder,
    createElHelpers,
    effect,
    executeCallbacks,
    generateId,
    getElementByMeltId,
    isHTMLElement,
    kbd
} from '$lib/internal/helpers';

import type { CreateTreeViewArgs, ItemDescription, TreeParts } from './types';
import { onMount } from 'svelte';


const defaults = {
    collapse: false,
} satisfies Defaults<CreateTreeViewArgs>;

const ATTRS = {
    TABINDEX: 'tabindex',
    EXPANDED: 'aria-expanded',
    LABELLEDBY: 'aria-labelledby',
}

export function createTreeViewBuilder(args: CreateTreeViewArgs) {
    const argsWithDefaults = { ...defaults, ...args };
    const { collapse } = argsWithDefaults;

    const { name } = createElHelpers<TreeParts>('tree-view');

    /**
     * Track currently focused item in the tree.
     */
    const currentFocusedItem: Writable<HTMLLIElement | null> = writable(null);
    const currentSelectedItem: Writable<HTMLLIElement | null> = writable(null);

    let rootEl: HTMLElement | null;
    let items: HTMLLIElement[];
    let currentFocusedItemIdx = 0;
    const itemChildren: Writable<ItemDescription[]> = writable([]);

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
        }
    });

    const label = builder(name('label'), {
        returned: () => ({
            id: rootIds.label
        })
    });

    // const isSelected = (id: string) => get(currentFocusedItem)?.id === id;

    function updateFocusElement(newIndex: number) {
        items[currentFocusedItemIdx].setAttribute(ATTRS.TABINDEX, '-1');
        items[newIndex].setAttribute(ATTRS.TABINDEX, '0');
        items[newIndex].focus();
        currentFocusedItem.set(items[newIndex]);
        currentFocusedItemIdx = newIndex;
    }

    function updateSelectedElement(newIndex: number) {
        currentSelectedItem.set(items[newIndex]);
    }

    const item = builder(name('item'), {
        returned: () => {
            return (opts: { value: string, id: string, hasChildren?: boolean, expand?: boolean} ) => {
                // Have some default options that can be passed to the create()
                const { value, id } = opts;

                return {
                    role: 'treeitem',
                    // 'aria-expanded': '',
                    // 'aria-selected': isSelected(id),
                    // tabindex: $currentFocusedItem?.getAttribute('data-id') === itemId ? 0 : -1,
                    'data-id': id,
                    'data-value': value
                };
            };
        },
        action: (node: HTMLLIElement) => {

            const unsubEvents = executeCallbacks(
                addEventListener(node, 'keydown', async (e) => {
                    const { key } = e;

                    const isLetter = /^[a-z]$/i.test(key);

                    if (![kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.ENTER, kbd.SPACE, kbd.END, kbd.HOME, kbd.ASTERISK].includes(key) && !isLetter) {
                        return;
                    }

                    const el = e.target;

                    if (!rootEl || !isHTMLElement(el) || el.role !== 'treeitem' || !items.length) return;

                    // Prevent other tree events from also firing the event.
                    e.stopPropagation();
                    e.preventDefault();

                    if (key === kbd.ENTER || key === kbd.SPACE) {
                        updateSelectedElement(currentFocusedItemIdx);
                    }
                    
                    else if (key === kbd.ARROW_DOWN && currentFocusedItemIdx !== items.length - 1) {
                        updateFocusElement(currentFocusedItemIdx + 1);
                    } 
                    
                    else if (key === kbd.ARROW_UP && currentFocusedItemIdx !== 0) {
                        updateFocusElement(currentFocusedItemIdx - 1);
                    } 
                    
                    else if (key === kbd.HOME && currentFocusedItemIdx !== 0) {
                        updateFocusElement(0);
                    } 
                    
                    else if (key === kbd.END && currentFocusedItemIdx != items.length - 1) {
                        updateFocusElement(items.length - 1);
                    }

                    else if (isLetter) {
                        /** 
                         * Check whether a value with the letter exists
                         * after the current focused element and focus it,
                         * if it does exist. If it does not exist, we check
                         * previous values.
                         */ 
                        const values = items.map((item) => ({ value: item.getAttribute('data-value'), id: item.getAttribute('data-id') }));

                        let nextFocusIdx = -1;

                        // Check elements after currently focused one.
                        let foundNextFocusable = values.slice(currentFocusedItemIdx + 1).some((item, i) => {
                            if (item.value?.toLowerCase().at(0) === key) {
                                nextFocusIdx = currentFocusedItemIdx + 1 + i;
                                return true;
                            }

                            return false;
                        })

                        if (!foundNextFocusable) {
                            /** 
                             * Check elements before currently focused one,
                             * if no index has been found yet.
                             * */ 
                            foundNextFocusable = values.slice(0, currentFocusedItemIdx).some((item, i) => {
                                if (item.value?.toLowerCase().at(0) === key) {
                                    nextFocusIdx = i;
                                    return true;
                                }

                                return false;
                            });
                        }

                        if (foundNextFocusable && values[nextFocusIdx].id) {
                            updateFocusElement(nextFocusIdx);
                        } 
                    }
                }),
                addEventListener(node, 'click', async (e) => {
                    e.stopPropagation();
                    const el = e.currentTarget;

                    if (!rootEl || !isHTMLElement(el) || el.role !== 'treeitem' || !items.length) return;

                    const idx = items.findIndex((item) => item === el);

                    if (idx === -1) return;

                    updateSelectedElement(idx);
                    updateFocusElement(idx);
                })
            );

            return {
                destroy() {
                    unsubEvents();
                }
            }
        }
    });

    const group = builder(name('group'), {
        returned: () => ({
            role: 'group',
        })
    });

    function getChildrenOfItems(): ItemDescription[] {
        return items.map((item) => {
            const groups = Array.from(item.querySelectorAll('ul[role="group"]'));

            const hasChildren = groups.length > 0;
            const childrenIdxs: number[] = [];

            if (hasChildren) {
                const children = <HTMLLIElement[]>Array.from(groups[0].querySelectorAll(':scope > li[role="treeitem"]'));

                children.forEach((child) => childrenIdxs.push(items.indexOf(child)))
            }

            return {
                collapsed: collapse,
                hasChildren,
                childrenIdxs
            }
        });
    }

    onMount(() => {
        rootEl = getElementByMeltId(rootIds.tree);

        if (!rootEl) return;
        items = Array.from(rootEl.querySelectorAll('li[role="treeitem"]'));

        if (items.length === 0) return;

        // Add ids for each element.
        items.forEach((item) => {
            // item.setAttribute('data-id', generateId());
            item.setAttribute(ATTRS.TABINDEX, '-1');
        });

        /**
         * Set the first item to be the current focused one,
         * and make it tabbable.
         */
        currentFocusedItem.set(items[0]);
        items[0].setAttribute(ATTRS.TABINDEX, '0');

        // Get the children idxs of each item.
        itemChildren.set(getChildrenOfItems());

        // Add aria-expanded role for items with children.
        get(itemChildren).forEach((item, i) => {
            if (item.hasChildren) items[i].setAttribute(ATTRS.EXPANDED, `${!collapse}`);
        });
    });

    return {
        tree: rootTree,
        label,
        item,
        rootIds,
        group,
        currentFocusedItem,
        currentSelectedItem
    }
}