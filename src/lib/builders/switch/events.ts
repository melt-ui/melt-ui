import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const switchEvents = {
	root: ['click', 'keydown'] as const,
};

export type SwitchEvents = GroupedEvents<typeof switchEvents>;
export type SwitchComponentEvents = MeltComponentEvents<SwitchEvents>;
