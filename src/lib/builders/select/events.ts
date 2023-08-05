import type { GroupedEvents } from '$lib/internal/types';

export const selectEvents = {
	menu: ['keydown'] as const,
	trigger: ['click', 'keydown'] as const,
	label: ['click'] as const,
	option: ['click', 'keydown', 'pointermove', 'pointerleave', 'focusin', 'focusout'] as const,
};

export type SelectEvents = GroupedEvents<typeof selectEvents>;
