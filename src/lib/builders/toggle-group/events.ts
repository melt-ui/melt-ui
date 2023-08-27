import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const toggleGroupEvents = {
	item: ['click', 'keydown'] as const,
};

export type ToggleGroupEvents = GroupedEvents<typeof toggleGroupEvents>;
export type ToggleGroupComponentEvents = MeltComponentEvents<ToggleGroupEvents>;
