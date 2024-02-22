import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { Writable } from 'svelte/store';
import type { createTreeView } from './create.js';

export type CreateTreeViewProps = {
	/**
	 * Whether or not to force the tree to always be visible.
	 * 
	 * This is useful for custom transitions and animations using conditional blocks.
	 * 
	 * @default false
	 */
	forceVisible?: boolean;

	/**
	 * Which tree items are expanded by default.
	 *
	 * @default []
	 */
	defaultExpanded?: string[];

	/**
	 * Optionally pass a writable store to control the expanded items of the tree.
	 * If provided, this will override the value of the `defaultTree` prop.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	expanded?: Writable<string[]>;

	/**
	 * A callback called when the value of the `expanded` store should be changed.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onExpandedChange?: ChangeFn<string[]>;
};

export type TreeParts = 'label' | 'item' | 'group';

export type ItemDescription = {
	hasChildren: boolean;
	childrenIdxs: number[];
};

export type TreeView = ReturnType<typeof createTreeView>;
export type TreeViewElements = TreeView['elements'];
export type TreeViewStates = TreeView['states'];
export type TreeViewHelpers = TreeView['helpers'];
