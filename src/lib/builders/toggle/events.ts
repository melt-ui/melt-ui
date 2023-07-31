import type { GroupedEvents } from '$lib/internal/types';

export const toggleEvents = {
	root: ['click', 'keydown'] as const,
};
export type ToggleEvents = GroupedEvents<typeof toggleEvents>;
