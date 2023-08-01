import type { GroupedEvents } from '$lib/internal/types';

export const tagsInputEvents = {
	root: ['mousedown'] as const,
	input: ['focus', 'blur', 'paste', 'keydown', 'input'] as const,
	tag: ['mousedown', 'click', 'dblclick'] as const,
	deleteTrigger: ['click', 'keydown'] as const,
	edit: ['blur', 'keydown', 'input'] as const,
};

export type TagsInputEvents = GroupedEvents<typeof tagsInputEvents>;
