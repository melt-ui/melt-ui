import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const spinButtonEvents = {
	root: ['keydown'],
	incrementer: ['click'],
	decrementer: ['click'],
} as const;

export type SpinButtonEvents = GroupedEvents<typeof spinButtonEvents>;
export type SpinButtonComponentEvents = MeltComponentEvents<SpinButtonEvents>;
