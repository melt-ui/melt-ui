import type { GroupedEvents } from '$lib/internal/types';

export const sliderEvents = {
	thumb: ['keydown'] as const,
};

export type SliderEvents = GroupedEvents<typeof sliderEvents>;
