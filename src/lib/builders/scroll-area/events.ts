import type { GroupedEvents } from '$lib/internal/types.js';

export const scrollAreaEvents = {
	scrollbar: ['pointerdown', 'pointerup', 'pointermove'],
	thumb: ['pointerdown', 'pointerup'],
} as const;

export type ScrollAreaEvents = GroupedEvents<typeof scrollAreaEvents>;
