import type { GroupedEvents } from '$lib/internal/types';

export const pinInputEvents = {
	input: ['keydown', 'input', 'paste', 'change', 'focus', 'blur'] as const,
};

export type PinInputEvents = GroupedEvents<typeof pinInputEvents>;
