import type { GroupedEvents } from '$lib/internal/types';

export const sortableEvents = {
	zone: ['pointerdown', 'mouseenter', 'mouseleave'] as const,
	// 	input: ['focus', 'blur', 'paste', 'keydown', 'input'] as const,
	// 	tag: ['mousedown', 'click', 'dblclick'] as const,
	// 	deleteTrigger: ['click', 'keydown'] as const,
	// 	edit: ['blur', 'keydown', 'input'] as const,
};

export type SortableEvents = GroupedEvents<typeof sortableEvents>;
