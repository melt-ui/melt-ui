import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const listboxEvents = {
	trigger: ['click', 'keydown', 'input'] as const,
	menu: ['pointerleave'] as const,
	item: ['pointermove', 'click'] as const,
};

export type ListboxEvents = GroupedEvents<typeof listboxEvents>;
export type ListboxComponentEvents = MeltComponentEvents<ListboxEvents>;
