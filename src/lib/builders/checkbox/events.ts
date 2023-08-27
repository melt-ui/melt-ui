import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const checkboxEvents = {
	root: ['keydown', 'click'] as const,
};

export type CheckboxEvents = GroupedEvents<typeof checkboxEvents>;
export type CheckboxComponentEvents = MeltComponentEvents<CheckboxEvents>;
