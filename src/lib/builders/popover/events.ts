import type { GroupedEvents } from '$lib/internal/types';

export const popoverEvents = {
	trigger: ['click', 'keydown'] as const,
	close: ['click', 'keydown'] as const,
};

export type PopoverEvents = GroupedEvents<typeof popoverEvents>;
