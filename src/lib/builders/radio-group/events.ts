import type { GroupedEvents } from '$lib/internal/types';

export const radioGroupEvents = {
	item: ['click', 'focus', 'keydown'] as const,
};

export type RadioGroupEvents = GroupedEvents<typeof radioGroupEvents>;
