import type { GroupedEvents } from '$lib/internal/types';

export const sortableEvents = {
	zone: ['pointerdown', 'pointerenter', 'pointerleave'] as const,
};

export type SortableEvents = GroupedEvents<typeof sortableEvents>;
