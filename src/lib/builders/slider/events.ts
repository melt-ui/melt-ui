import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const sliderEvents = {
	thumb: ['keydown'] as const,
};

export type SliderEvents = GroupedEvents<typeof sliderEvents>;
export type SliderComponentEvents = MeltComponentEvents<SliderEvents>;
