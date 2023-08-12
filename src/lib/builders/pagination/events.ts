import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const paginationEvents = {
	pageTrigger: ['click', 'keydown'] as const,
	nextButton: ['click', 'keydown'] as const,
	prevButton: ['click', 'keydown'] as const,
};

export type PaginationEvents = GroupedEvents<typeof paginationEvents>;
export type PaginationComponentEvents = MeltComponentEvents<PaginationEvents>;
