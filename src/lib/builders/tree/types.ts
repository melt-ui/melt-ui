import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { createTreeView } from './create.js';

export type CreateTreeViewProps = {
	forceVisible?: ReadableProp<boolean>;

	/**
	 * Which tree items are expanded by default.
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

