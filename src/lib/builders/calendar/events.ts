import type { GroupedEvents } from '$lib/internal/types.js';

export const calendarEvents = {
	calendar: ['keydown'] as const,
	prevButton: ['click'] as const,
	nextButton: ['click'] as const,
	cell: ['click'] as const,
};

export type CalendarEvents = GroupedEvents<typeof calendarEvents>;
