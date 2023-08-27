import type { MeltComponentEvents } from '$lib/internal/types.js';
import { menuEvents, type MenuEvents } from '../menu/events.js';

export const dropdownMenuEvents = menuEvents;
export type DropdownMenuEvents = MenuEvents;
export type DropdownMenuComponentEvents = MeltComponentEvents<DropdownMenuEvents>;
