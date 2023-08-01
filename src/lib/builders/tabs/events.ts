import type { GroupedEvents } from '$lib/internal/types';

export const tabsEvents = {
	trigger: ['focus', 'click', 'keydown'] as const,
};

export type TabsEvents = GroupedEvents<typeof tabsEvents>;
