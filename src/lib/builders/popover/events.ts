import type {
	GroupedEvents,
	MeltComponentEvents,
	InternalCustomEvents,
} from '$lib/internal/types.js';

export const popoverEvents = {
	trigger: ['click', 'keydown'] as const,
	close: ['click', 'keydown'] as const,
} as const;

export type PopoverEvents = GroupedEvents<typeof popoverEvents>;
export type PopoverComponentEvents = MeltComponentEvents<PopoverEvents>;
export type InternalPopoverHandlers = {
	[K in keyof PopoverEvents]?: InternalCustomEvents<PopoverEvents[K]>;
};
