import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const tooltipEvents = {
	trigger: ['pointerdown', 'pointerenter', 'pointerleave', 'focus', 'blur', 'keydown'] as const,
	content: ['pointerenter', 'pointerdown'] as const,
};
export type TooltipEvents = GroupedEvents<typeof tooltipEvents>;
export type TooltipComponentEvents = MeltComponentEvents<TooltipEvents>;
