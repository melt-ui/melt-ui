import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const toastEvents = {
	content: ['pointerenter', 'pointerleave', 'focusout'] as const,
	close: ['click', 'keydown'] as const,
};

export type ToastEvents = GroupedEvents<typeof toastEvents>;
export type ToastComponentEvents = MeltComponentEvents<ToastEvents>;
