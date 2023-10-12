import { effect, toWritableStores, omit } from '$lib/internal/helpers/index.js';
import { get } from 'svelte/store';
import { createRangeCalendar, createPopover } from '$lib/builders/index.js';
import type { CreateDateRangePickerProps } from './types.js';
import {
	handleSegmentNavigation,
	isSegmentNavigationKey,
} from '$lib/internal/helpers/date/index.js';

import { dateStore, createFormatter, getDefaultDate } from '$lib/internal/helpers/date/index.js';
import { createDateRangeField } from '../date-range-field/create.js';

const defaults = {
	isDisabled: undefined,
	isUnavailable: undefined,
	value: undefined,
	positioning: {
		placement: 'bottom',
	},
	closeOnEscape: true,
	closeOnOutsideClick: true,
	preventScroll: false,
	forceVisible: false,
	locale: 'en',
	granularity: 'day',
} satisfies CreateDateRangePickerProps;

const defaultTriggerAttrs = {
	'data-segment': 'trigger',
};

export function createDateRangePicker(props?: CreateDateRangePickerProps) {
	const withDefaults = { ...defaults, ...props };

	const rangeField = createDateRangeField(withDefaults);

	const {
		states: { value, placeholderValue: rfPlaceholderValue },
	} = rangeField;

	const calendar = createRangeCalendar({
		...withDefaults,
		placeholderValue: rfPlaceholderValue,
		value: value,
		ids: withDefaults.calendarIds,
	});

	const popover = createPopover({
		positioning: withDefaults.positioning,
		arrowSize: withDefaults.arrowSize,
		defaultOpen: withDefaults.defaultOpen,
		open: withDefaults.open,
		disableFocusTrap: withDefaults.disableFocusTrap,
		closeOnEscape: withDefaults.closeOnEscape,
		preventScroll: withDefaults.preventScroll,
		onOpenChange: withDefaults.onOpenChange,
		closeOnOutsideClick: withDefaults.closeOnOutsideClick,
		portal: withDefaults.portal,
		forceVisible: withDefaults.forceVisible,
		attrs: {
			trigger: {
				...defaultTriggerAttrs,
				'aria-label': 'Open date picker',
			},
		},
		handlers: {
			trigger: {
				keydown: handleTriggerKeydown,
			},
		},
		focusTrap: {
			// We want to focus the focused date when the popover
			// is open regardless of the DOM order
			initialFocus: `[data-melt-calendar-cell][data-focused]`,
		},
	});

	const {
		states: { open },
	} = popover;

	const options = toWritableStores({
		...omit(withDefaults, 'value', 'placeholderValue'),
		...popover.options,
	});

	const { locale } = options;

	const defaultDate = getDefaultDate({
		defaultValue: withDefaults.defaultValue?.start,
		defaultPlaceholderValue: withDefaults.defaultPlaceholderValue,
		granularity: withDefaults.granularity,
	});

	const formatter = createFormatter(get(locale));

	const placeholderValue = dateStore(
		rfPlaceholderValue,
		withDefaults.defaultPlaceholderValue ?? defaultDate
	);

	effect([locale], ([$locale]) => {
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	effect([open], ([$open]) => {
		if (!$open) {
			const $value = get(value);
			if ($value?.start) {
				placeholderValue.set($value.start);
			} else {
				placeholderValue.reset();
			}
		}
	});

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			e.preventDefault();
			handleSegmentNavigation(e, rangeField.ids.field);
		}
	}

	return {
		elements: {
			...calendar.elements,
			...rangeField.elements,
			...popover.elements,
		},
		states: {
			...rangeField.states,
			...calendar.states,
			placeholderValue: placeholderValue.toWritable(),
			value,
			...popover.states,
		},
		helpers: {
			...calendar.helpers,
		},
		options,
		ids: {
			rangeField: rangeField.ids,
			calendar: calendar.ids,
			popover: popover.ids,
		},
	};
}
