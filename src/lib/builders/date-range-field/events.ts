import type { GroupedEvents } from '$lib/internal/types.js';

export const dateRangeFieldEvents = {
	startSegment: ['keydown', 'focusout', 'click'] as const,
	endSegment: ['keydown', 'focusout', 'click'] as const,
};

export type DateRangeFieldEvents = GroupedEvents<typeof dateRangeFieldEvents>;
