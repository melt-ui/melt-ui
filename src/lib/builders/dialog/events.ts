import type { GroupedEvents } from '$lib/internal/types.js';
export const dialogEvents = {
	trigger: ['click', 'keydown'] as const,
	close: ['click', 'keydown'] as const,
};

export type DialogEvents = GroupedEvents<typeof dialogEvents>;
