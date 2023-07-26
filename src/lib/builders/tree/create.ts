import { get, writable } from 'svelte/store';
import {
    addEventListener,
    builder,
    createElHelpers,
    effect,
    executeCallbacks,
    generateId,
    getElementByMeltId,
    getNextFocusable,
    getPreviousFocusable,
    isHTMLElement,
    kbd
} from '$lib/internal/helpers';

import type { TreeParts, TreeViewOptions } from './types';
import { onMount } from 'svelte';

export function createTreeViewBuilder(opts: TreeViewOptions) {
    // const { id } = opts;

    const { name } = createElHelpers<TreeParts>('tree-view');

    /**
     * Track currently focused item in the tree.
     */
    const currentFocusedItem = writable<HTMLLIElement | null>(null);

    let rootEl: HTMLElement | null;
    let items: HTMLLIElement[];
    let currentFocusedItemIdx = 0;

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
        items[currentFocusedItemIdx].setAttribute('tabindex', '-1');
        items[newIndex].setAttribute('tabindex', '0');
        items[newIndex].focus();
        currentFocusedItem.set(items[newIndex]);
        currentFocusedItemIdx = newIndex;
    }

    const item = builder(name('item'), {
        returned: () => {
            return (value: string) => {
                /**
                 * TODO: only one item should have tabindex 0, 
                 * all others should have -1.
                 */

                return {
                    role: 'treeitem',
                    // 'aria-expanded': '',
                    // 'aria-selected': isSelected(id),
                    // tabindex: $currentFocusedItem?.getAttribute('data-id') === itemId ? 0 : -1,
                    // 'data-id': itemId,
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
                    
                    if (key === kbd.ARROW_DOWN && currentFocusedItemIdx !== items.length - 1) {
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

    onMount(() => {
        rootEl = getElementByMeltId(rootIds.tree);

        if (!rootEl) return;
        items = Array.from(rootEl.querySelectorAll('li[role="treeitem"]'));

        if (items.length === 0) return;

        // Add ids for each element.
        items.forEach((item) => {
            item.setAttribute('data-id', generateId());
            item.setAttribute('tabindex', '-1');
        });

        // Set the first item to be the current focus one.
        currentFocusedItem.set(items[0]);
        items[0].setAttribute('tabindex', '0');
    });

    return {
        tree: rootTree,
        label,
        item,
        rootIds,
        group,
        currentFocusedItem
    }
}