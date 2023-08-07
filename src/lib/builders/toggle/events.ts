import type { GroupedEvents } from '$lib/internal/types.js';

export const toggleEvents = {
	root: ['click', 'keydown'] as const,
};
export type ToggleEvents = GroupedEvents<typeof toggleEvents>;
