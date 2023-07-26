import type { createTreeViewBuilder  } from "./create";

export type TreeViewOptions = {
    id: string
};

export type TreeParts =
	| 'trigger'
	| 'label'
	| 'item'
	| 'group';

export type CreateTreeViewReturn = ReturnType<typeof createTreeViewBuilder>;