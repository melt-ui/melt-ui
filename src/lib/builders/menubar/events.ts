import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';
import { menuEvents } from '../menu/events.js';

export const menubarEvents = {
	...menuEvents,
	menu: ['keydown'] as const,
	trigger: ['click', 'keydown', 'pointerenter'] as const,
};

export type MenubarEvents = GroupedEvents<typeof menubarEvents>;
export type MenubarComponentEvents = MeltComponentEvents<MenubarEvents>;
