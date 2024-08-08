import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const chartEvents = {
	root: [] as const,
};

export type ChartEvents = GroupedEvents<typeof chartEvents>;
export type ChartComponentEvents = MeltComponentEvents<ChartEvents>;
