import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { createTreeView } from './create.js';

export type CreateTreeViewProps = {
	/**
	 * Whether or not to force the tree to always be visible.
	 *
	 * This is useful for custom transitions and animations using conditional blocks.
	 *
	 * @default false
	 */
	forceVisible?: ReadableProp<boolean>;

	/**
	 * Which tree items are expanded.
	 *
	 * @default []
	 */
	expanded?: ReadableProp<string[]>;
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
