import type { createTreeViewBuilder  } from "./create";

export type CreateTreeViewArgs = {
	collapse: boolean
};

export type TreeParts =
	| 'trigger'
	| 'label'
	| 'item'
	| 'group';

export type ItemDescription = {
    collapsed: boolean;
    hasChildren: boolean;
    childrenIdxs: number[];
};

export type CreateTreeViewReturn = ReturnType<typeof createTreeViewBuilder>;