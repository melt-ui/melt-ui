import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const accordionEvents = {
	trigger: ['keydown', 'click'] as const,
};

/**
 * @category Accordion
 */
export type AccordionEvents = GroupedEvents<typeof accordionEvents>;

/**
 * @category Accordion
 */
export type AccordionComponentEvents = MeltComponentEvents<AccordionEvents>;
