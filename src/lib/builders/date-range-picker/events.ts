import type { GroupedEvents } from '$lib/internal/types.js';
import { dateRangeFieldEvents } from '../date-range-field/events.js';
import { popoverEvents } from '../popover/events.js';
import { rangeCalendarEvents } from '../range-calendar/events.js';

export const dateRangePickerEvents = {
	...dateRangeFieldEvents,
	...popoverEvents,
	...rangeCalendarEvents,
};

export type DateRangePickerEvents = GroupedEvents<typeof dateRangePickerEvents>;
