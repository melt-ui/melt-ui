import type { GroupedEvents } from '$lib/internal/types';
import { menuEvents } from '../menu/events';

export const menubarEvents = {
	...menuEvents,
	menu: ['keydown'] as const,
	trigger: ['click', 'keydown', 'pointerenter'] as const,
};

export type MenubarEvents = GroupedEvents<typeof menubarEvents>;
