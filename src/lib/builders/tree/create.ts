import { get, writable, type Writable } from 'svelte/store';
import type { Defaults } from "$lib/internal/types";
import {
    addEventListener,
    builder,
    createElHelpers,
    executeCallbacks,
    generateId,
    getElementByMeltId,
    isBrowser,
    isHTMLElement,
    kbd,
    styleToString
} from '$lib/internal/helpers';

import type { CreateTreeViewArgs, ItemDescription, TreeParts } from './types';
import { onMount, tick } from 'svelte';


const defaults = {
    forceVisible: false,
} satisfies Defaults<CreateTreeViewArgs>;

const ATTRS = {
    TABINDEX: 'tabindex',
    EXPANDED: 'aria-expanded',
    LABELLEDBY: 'aria-labelledby',
    DATAID: 'data-id'
}

const { name } = createElHelpers<TreeParts>('tree-view');

export function createTreeViewBuilder(args: CreateTreeViewArgs) {
    const argsWithDefaults = { ...defaults, ...args };
    const { forceVisible } = argsWithDefaults;

    /**
     * Track currently focused item in the tree.
     */
    const focusedItem: Writable<HTMLLIElement | null> = writable(null);
    const selectedItem: Writable<HTMLLIElement | null> = writable(null);
    const selectedId: Writable<string | null> = writable(null);
    const collapsedItems: Writable<string[]> = writable([]);

    let rootEl: HTMLElement | null;
    let items: HTMLLIElement[];
    let focusedItemIdx = 0;
    let itemChildren: ItemDescription[] = [];

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

    function updateFocusedElement(newIndex: number) {
        /**
         * Items should not be navigatable with tabs,
         * so we always update the tabindex so that only the currently
         * focused element has a focusable tabindex.
         */
        items[focusedItemIdx].setAttribute(ATTRS.TABINDEX, '-1');
        items[newIndex].setAttribute(ATTRS.TABINDEX, '0');
        focusedItem.set(items[newIndex]);
        focusedItemIdx = newIndex;
        items[newIndex].focus();
    }

    function updateSelectedElement(el: HTMLLIElement) {
        selectedItem.set(el);

        const id = el.getAttribute(ATTRS.DATAID);
        if (!id) return;

        selectedId.set(id);
    }

    /**
     * After trees get expanded or collapsed, we need to 
     * update our list of items to properly reflect those changes.
     */
    async function updateItemList(el: HTMLLIElement) {
        await tick();

        rootEl = getElementByMeltId(rootIds.tree);
        if (!rootEl) return;

        // Select all 'treeitem' li elements within our root element.
        items = Array.from(rootEl.querySelectorAll('li[role="treeitem"]'));

        /**
         * Filter out all elements that have parents that are not expanded.
         * I think we might need this in case tick() doesn't work with animations.
         */
        const closedParents = Array.from(rootEl.querySelectorAll('li[aria-expanded="false"]'));
        items = items.filter((item) => !closedParents.some((parent) => item !== parent && parent.contains(item)));

        itemChildren = getChildrenOfItems();

        // Update the current focus index.
        focusedItemIdx = items.findIndex((item) => item === el);

        // Add tabindex to newly added elements. (not doing this caused flickering)
        items.forEach((item) => {
            if (!item.hasAttribute(ATTRS.TABINDEX)) {
                item.setAttribute(ATTRS.TABINDEX, '-1');
            }
        });
    }

    function getElementAttributes(el: HTMLLIElement) {
        const hasChildren = el.hasAttribute(ATTRS.EXPANDED);        
        const expanded = el.getAttribute(ATTRS.EXPANDED);
        const dataId = el.getAttribute(ATTRS.DATAID);

        return {
            hasChildren,
            expanded,
            dataId
        }
    }

    async function showChildrenElements(el: HTMLLIElement) {
        const { hasChildren, expanded, dataId } = getElementAttributes(el);

        if (!hasChildren || expanded === null || dataId === null) return;

        const hidden = get(collapsedItems);

        if (expanded === 'false') {
            collapsedItems.set(hidden.filter((item) => item !== dataId))
            el.setAttribute(ATTRS.EXPANDED, 'true');

            await updateItemList(el);
        } 
    }

    async function hideChildrenElements(el: HTMLLIElement) {
        const { hasChildren, expanded, dataId } = getElementAttributes(el);

        if (!hasChildren || expanded === null || dataId === null) return;

        const hidden = get(collapsedItems);

        if (expanded === 'true') {
            collapsedItems.set([...hidden, dataId]);
            el.setAttribute(ATTRS.EXPANDED, 'false');

            await updateItemList(el);
        }        
    }

    function elementHasChildren(el: HTMLLIElement) {
        return el.hasAttribute(ATTRS.EXPANDED);
    }

    function elementIsExpanded(el: HTMLLIElement) {
        return el.getAttribute(ATTRS.EXPANDED) === 'true';
    }

    async function handleHiddenElements(el: HTMLLIElement) {      
        const { hasChildren, expanded, dataId } = getElementAttributes(el);

        if (!hasChildren || expanded === null || dataId === null) return;

        const hidden = get(collapsedItems);

        if (expanded === 'false') {
            // Remove id from hidden items.
            collapsedItems.set(hidden.filter((item) => item !== dataId))
            el.setAttribute(ATTRS.EXPANDED, 'true');
        } else {
            // Add id to hidden items.
            collapsedItems.set([...hidden, dataId]);
            el.setAttribute(ATTRS.EXPANDED, 'false');
        }

        await updateItemList(el);
    }

    const item = builder(name('item'), {
        stores: [collapsedItems, selectedId],
        returned: ([$collapsedItems, $selectedId]) => {
            return (opts: { value: string, id: string, hasChildren: boolean} ) => {
                // Have some default options that can be passed to the create()
                const { value, id, hasChildren } = opts;

                const expanded = hasChildren ? { 'aria-expanded': !$collapsedItems.includes(id) } : {};

                return {
                    role: 'treeitem',
                    'aria-selected': id === $selectedId,
                    'data-id': id,
                    'data-value': value,
                    ...expanded
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
                    
                    if (!rootEl || !isHTMLElement(el) || el.getAttribute('role') !== 'treeitem' || items.length === 0) return;

                    // Prevent other tree events from also firing the event.
                    e.stopPropagation();
                    e.preventDefault();

                    if (key === kbd.ENTER || key === kbd.SPACE) {
                        updateSelectedElement(items[focusedItemIdx]);
                    }
                    
                    else if (key === kbd.ARROW_DOWN && focusedItemIdx !== items.length - 1) {
                        updateFocusedElement(focusedItemIdx + 1);
                    } 
                    
                    else if (key === kbd.ARROW_UP && focusedItemIdx !== 0) {
                        updateFocusedElement(focusedItemIdx - 1);
                    } 
                    
                    else if (key === kbd.HOME && focusedItemIdx !== 0) {
                        updateFocusedElement(0);
                    } 
                    
                    else if (key === kbd.END && focusedItemIdx != items.length - 1) {
                        updateFocusedElement(items.length - 1);
                    } 
                    
                    else if (key === kbd.ARROW_LEFT && elementHasChildren(<HTMLLIElement>el) && elementIsExpanded(<HTMLLIElement>el)) {
                        await hideChildrenElements(<HTMLLIElement>el);
                    }

                    else if (key === kbd.ARROW_LEFT) {
                        const parentIdx = itemChildren.findIndex((item) => item.childrenIdxs.includes(focusedItemIdx));

                        if (parentIdx === -1) return;

                        updateFocusedElement(parentIdx);
                    }

                    else if (key === kbd.ARROW_RIGHT && elementHasChildren(<HTMLLIElement>el) && elementIsExpanded(<HTMLLIElement>el)) {
                        updateFocusedElement(focusedItemIdx + 1);
                    }
                    
                    else if (key === kbd.ARROW_RIGHT && elementHasChildren(<HTMLLIElement>el) && !elementIsExpanded(<HTMLLIElement>el)) {
                        await showChildrenElements(<HTMLLIElement>el);
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
                        let foundNextFocusable = values.slice(focusedItemIdx + 1).some((item, i) => {
                            if (item.value?.toLowerCase().at(0) === key) {
                                nextFocusIdx = focusedItemIdx + 1 + i;
                                return true;
                            }

                            return false;
                        })

                        if (!foundNextFocusable) {
                            /** 
                             * Check elements before currently focused one,
                             * if no index has been found yet.
                             * */ 
                            foundNextFocusable = values.slice(0, focusedItemIdx).some((item, i) => {
                                if (item.value?.toLowerCase().at(0) === key) {
                                    nextFocusIdx = i;
                                    return true;
                                }

                                return false;
                            });
                        }

                        if (foundNextFocusable && values[nextFocusIdx].id) {
                            updateFocusedElement(nextFocusIdx);
                        } 
                    }
                }),
                addEventListener(node, 'click', async (e) => {
                    const el = e.currentTarget;
                    
                    if (!rootEl || !isHTMLElement(el) || el.getAttribute('role') !== 'treeitem' || !items.length) return;
                    
                    e.stopPropagation();

                    
                    await handleHiddenElements(<HTMLLIElement>el);
                    
                    updateSelectedElement(<HTMLLIElement>el);

                    const idx = items.findIndex((item) => item === el);
                    if (idx === -1) return;

                    updateFocusedElement(idx);
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
        stores: [collapsedItems],
        returned: ([$collapsedItems]) => {
            return (opts: { id: string }) => ({
                role: 'group',
                'data-group-id': opts.id,
                hidden: !forceVisible && isBrowser && $collapsedItems.includes(opts.id) ? true : undefined,
                style: styleToString({
                    display: !forceVisible && $collapsedItems.includes(opts.id) ? 'none' : undefined
                })
            })
        },
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

        // Add tabindex for each element.
        items.forEach((item) => {
            item.setAttribute(ATTRS.TABINDEX, '-1');
        });

        /**
         * Set the first item to be the current focused one,
         * and make it tabbable.
         */
        focusedItem.set(items[0]);
        items[0].setAttribute(ATTRS.TABINDEX, '0');

        // Get the children idxs of each item.
        itemChildren = getChildrenOfItems();

        // Add aria-expanded role for items with children.
        itemChildren.forEach((item, i) => {
            if (item.hasChildren) {
                items[i].setAttribute(ATTRS.EXPANDED, 'true');
            }
        });
    });

    return {
        elements: {
            tree: rootTree,
            label,
            item,
            group
        },
        states: {
            collapsedItems,
            focusedItem,
            selectedItem
        }
    }
}