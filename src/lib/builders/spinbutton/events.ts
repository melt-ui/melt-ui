import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types';

export const spinbuttonEvents = {
	increaseTrigger: ['click'] as const,
	decreaseTrigger: ['click'] as const,
	content: ['keydown'] as const,
};

export type SpinbuttonEvents = GroupedEvents<typeof spinbuttonEvents>;
export type SpinbuttonComponentEvents = MeltComponentEvents<SpinbuttonEvents>;
