import type { GroupedEvents } from '$lib/internal/types.js';

export const dateFieldEvents = {
	segment: ['keydown', 'focusout', 'click'] as const,
};

export type DateFieldEvents = GroupedEvents<typeof dateFieldEvents>;
