import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const linkPreviewEvents = {
	trigger: ['pointerenter', 'pointerleave', 'focus', 'blur'] as const,
	content: ['pointerdown', 'pointerenter', 'pointerleave', 'focusout'] as const,
};

export type LinkPreviewEvents = GroupedEvents<typeof linkPreviewEvents>;
export type LinkPreviewComponentEvents = MeltComponentEvents<LinkPreviewEvents>;
