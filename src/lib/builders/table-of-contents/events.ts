import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const tableOfContentsEvents = {
	item: ['click'] as const,
};

export type TableOfContentsEvents = GroupedEvents<typeof tableOfContentsEvents>;
export type TableOfContentsComponentEvents = MeltComponentEvents<TableOfContentsEvents>;
