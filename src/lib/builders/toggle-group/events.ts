import type { GroupedEvents } from '$lib/internal/types';

export const toggleGroupEvents = {
	item: ['click', 'keydown'] as const,
};

export type ToggleGroupEvents = GroupedEvents<typeof toggleGroupEvents>;
