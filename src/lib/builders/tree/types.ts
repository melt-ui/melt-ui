import type { createTreeViewBuilder  } from "./create";

export type TreeViewOptions = {
    id: string
};

export type TreeParts =
	| 'trigger'
	| 'item'
	| 'group';

export type CreateTreeViewReturn = ReturnType<typeof createTreeViewBuilder>;