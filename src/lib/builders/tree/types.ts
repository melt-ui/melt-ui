import type { createTreeViewBuilder  } from "./create";

// TODO: add multiselect option?
export type CreateTreeViewArgs = {
	collapse?: boolean;
	// multiselect?: boolean;
};

export type TreeParts =
	| 'label'
	| 'item'
	| 'group';

export type ItemDescription = {
    collapsed: boolean;
    hasChildren: boolean;
    childrenIdxs: number[];
};

export type CreateTreeViewReturn = ReturnType<typeof createTreeViewBuilder>;