import type { GroupedEvents } from '$lib/internal/types';

export const comboboxEvents = {
	input: ['click', 'keydown', 'input'] as const,
	menu: ['pointerleave'] as const,
	item: ['pointermove', 'click'] as const,
};

export type ComboboxEvents = GroupedEvents<typeof comboboxEvents>;
