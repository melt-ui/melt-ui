import type { GroupedEvents } from '$lib/internal/types.js';
import { menuEvents } from '../menu/events.js';

export const contextMenuEvents = {
	...menuEvents,
	menu: ['keydown'] as const,
	trigger: ['contextmenu', 'pointerdown', 'pointermove', 'pointercancel', 'pointerup'] as const,
};

export type ContextMenuEvents = GroupedEvents<typeof contextMenuEvents>;
