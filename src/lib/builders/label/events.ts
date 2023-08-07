import type { GroupedEvents } from '$lib/internal/types.js';

export const labelEvents = {
	root: ['mousedown'] as const,
};

export type LabelEvents = GroupedEvents<typeof labelEvents>;
