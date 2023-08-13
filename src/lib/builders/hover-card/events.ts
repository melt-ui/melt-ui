import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const hoverCardEvents = {
	trigger: ['pointerenter', 'pointerleave', 'focus', 'blur', 'touchstart'] as const,
	content: ['pointerdown', 'pointerenter', 'pointerleave', 'focusout'] as const,
};

export type HoverCardEvents = GroupedEvents<typeof hoverCardEvents>;
export type HoverCardComponentEvents = MeltComponentEvents<HoverCardEvents>;
