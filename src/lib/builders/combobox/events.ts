import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';
import { listboxEvents } from '../listbox/events.js';

export const comboboxEvents = {
	...listboxEvents,
	input: ['click', 'keydown', 'input'] as const,
};

export type ComboboxEvents = GroupedEvents<typeof comboboxEvents>;
export type ComboboxComponentEvents = MeltComponentEvents<ComboboxEvents>;
