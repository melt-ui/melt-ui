import type { GroupedEvents } from '$lib/internal/types.js';

export const switchEvents = {
	root: ['click', 'keydown'] as const,
};

export type SwitchEvents = GroupedEvents<typeof switchEvents>;
