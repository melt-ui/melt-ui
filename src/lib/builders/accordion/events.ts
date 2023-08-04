import type { GroupedEvents } from '$lib/internal/types.js';

export const accordionEvents = {
	trigger: ['keydown', 'click'] as const,
};

export type AccordionEvents = GroupedEvents<typeof accordionEvents>;
