import type { GroupedEvents } from '$lib/internal/types.js';

export const rangeCalendarEvents = {
	calendar: ['keydown'] as const,
	prevButton: ['click'] as const,
	nextButton: ['click'] as const,
	cell: ['click', 'mouseenter', 'focusin'] as const,
};

export type RangeCalendarEvents = GroupedEvents<typeof rangeCalendarEvents>;
