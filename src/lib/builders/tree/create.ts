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
    const { id } = opts;

    const { name } = createElHelpers<TreeParts>('tree-view');

    /**
     * Track currently focused item in the tree.
     */
    const currentFocusedItem = writable<HTMLElement | null>(null);

    let rootEl: HTMLElement | null;
    let items: Element[];

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

    const isSelected = (id: string) => get(currentFocusedItem)?.id === id;

    const item = builder(name('item'), {
        stores: [currentFocusedItem],
        returned: ([$currentFocusedItem]) => {
            const itemId = generateId();

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
                    const currentFocus = get(currentFocusedItem);

                    if (!rootEl || !isHTMLElement(el) || el.role !== 'treeitem' || !items.length) return;

                    // Prevent other tree events from also firing the event.
                    e.stopPropagation();
                    e.preventDefault();
                    
                    if (key === kbd.ARROW_DOWN && currentFocus !== items[items.length - 1]) {
                        const nextFocusable = getNextFocusable(<HTMLElement>el);
                        nextFocusable?.focus();
                        currentFocusedItem.set(nextFocusable);
                    } 
                    
                    else if (key === kbd.ARROW_UP && currentFocus !== items[0]) {
                        const previousFocusable = getPreviousFocusable(<HTMLElement>el);
                        previousFocusable?.focus();
                        currentFocusedItem.set(previousFocusable);
                    } 
                    
                    else if (key === kbd.HOME) { 
                        const firstItem = items[0];
                        currentFocusedItem.set(<HTMLElement>firstItem);
                        (<HTMLElement>firstItem).focus();
                    } 
                    
                    else if (key === kbd.END) {
                        const lastItem = items[items.length - 1];
                        currentFocusedItem.set(<HTMLElement>lastItem);
                        (<HTMLElement>lastItem).focus();
                    }

                    else if (isLetter) {
                        /** 
                         * Check whether a value with the letter exists
                         * after the current focused element and focus it,
                         * if it does exist. If it does not exist, we check
                         * previous values.
                         */ 

                        const values = items.map((item) => ({ value: item.getAttribute('data-value'), id: item.getAttribute('data-id') }));

                        const currentId = get(currentFocusedItem)?.getAttribute('data-id');

                        const currentIdx = values.findIndex((item) => item.id === currentId);

                        let nextFocusIdx = -1;

                        // Check elements after currently focused one.
                        let foundNextFocusable = values.slice(currentIdx + 1).some((item, i) => {
                            if (item.value?.toLowerCase().at(0) === key) {
                                nextFocusIdx = currentIdx + 1 + i;
                                return true;
                            }

                            return false;
                        })

                        if (!foundNextFocusable) {
                            /** 
                             * Check elements before currently focused one,
                             * if no index has been found yet.
                             * */ 
                            foundNextFocusable = values.slice(0, currentIdx).some((item, i) => {
                                if (item.value?.toLowerCase().at(0) === key) {
                                    nextFocusIdx = i;
                                    return true;
                                }

                                return false;
                            });
                        }

                        if (foundNextFocusable && values[nextFocusIdx].id) {
                            const nextFocusable = document.querySelectorAll(`[data-id="${values[nextFocusIdx].id}"]`);

                            if (nextFocusable.length === 0) return;

                            (<HTMLElement>nextFocusable[0])?.focus();
                            currentFocusedItem.set(<HTMLElement>nextFocusable[0]);
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
        items = Array.from(rootEl.querySelectorAll('[role="treeitem"]'));

        if (items.length === 0) return;

        // Add ids for each element.
        items.forEach((item) => {
            item.setAttribute('data-id', generateId());
            item.setAttribute('tabindex', '-1');
        });

        // Set the first item to be the current focus one.
        currentFocusedItem.set(<HTMLElement>items[0]);
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