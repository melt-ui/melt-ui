import type { GroupedEvents } from '$lib/internal/types';

export const tooltipEvents = {
	trigger: ['pointerdown', 'pointerenter', 'pointerleave', 'focus', 'blur', 'keydown'] as const,
	content: ['pointerenter', 'pointerdown'] as const,
};
export type TooltipEvents = GroupedEvents<typeof tooltipEvents>;
