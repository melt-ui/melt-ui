import type { GroupedEvents } from '$lib/internal/types';

export const accordionEvents = {
	trigger: ['keydown', 'click'] as const,
};

export type AccordionEvents = GroupedEvents<typeof accordionEvents>;
