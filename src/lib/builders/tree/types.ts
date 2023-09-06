import type { createTreeView } from './create';

export type CreateTreeViewProps = {
	forceVisible?: boolean;
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
