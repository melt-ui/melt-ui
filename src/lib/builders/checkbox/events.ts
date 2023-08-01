import type { GroupedEvents } from '$lib/internal/types';

export const checkboxEvents = {
	root: ['keydown', 'click'] as const,
};

export type CheckboxEvents = GroupedEvents<typeof checkboxEvents>;
