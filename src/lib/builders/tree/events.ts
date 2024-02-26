import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const treeEvents = {
	item: ['keydown', 'click', 'focus'] as const,
};

export type TreeEvents = GroupedEvents<typeof treeEvents>;
export type TreeComponentEvents = MeltComponentEvents<TreeEvents>;
