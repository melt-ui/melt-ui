import { get, writable } from 'svelte/store';
import {
    addEventListener,
    builder,
    createElHelpers,
    effect,
    executeCallbacks,
    generateId,
    getNextFocusable,
    getPreviousFocusable
} from '$lib/internal/helpers';

import type { TreeParts, TreeViewOptions } from './types';

export function createTreeViewBuilder(opts: TreeViewOptions) {
    const { id } = opts;

    const { name } = createElHelpers<TreeParts>('tree-view');

    /**
     * Track currently focused item in the tree.
     */
    const currentFocusedItem = writable<HTMLElement | null>(null);

    const rootIds = {
		tree: generateId(),
		label: generateId(),
	};

    const rootTree = builder(name(), {
        returned: () => {
            return {
                role: 'tree',
                'aria-labelledby': rootIds.label,
            } as const;
        }
    });

    const isSelected = (id: string) => get(currentFocusedItem)?.id === id;

    const item = builder(name('item'), {
        returned: () => {
            return (id: string) => ({
                role: 'treeitem',
                'aria-expanded': '',
                'aria-selected': isSelected(id),
            });
        },
        action: (node: HTMLLIElement) => {

            const unsubEvents = executeCallbacks(
                addEventListener(node, 'keydown', (e) => {
                    const { key } = e;
                })
            );

            return {
                destroy() {
                    unsubEvents();
                }
            }
        }
    });

    return {
        tree: rootTree,
        item,
        rootIds,
    }
}