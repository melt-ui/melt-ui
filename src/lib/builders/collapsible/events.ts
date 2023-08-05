import type { GroupedEvents } from '$lib/internal/types.js';

export const collapsibleEvents = {
	trigger: ['click'] as const,
};

export type CollapsibleEvents = GroupedEvents<typeof collapsibleEvents>;
