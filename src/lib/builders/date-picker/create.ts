import { effect, toWritableStores, omit } from '$lib/internal/helpers/index.js';
import { get } from 'svelte/store';
import { createCalendar, createDateField, createPopover } from '$lib/builders/index.js';
import type { CreateDatePickerProps } from './types.js';
import {
	handleSegmentNavigation,
	isSegmentNavigationKey,
} from '$lib/builders/date-field/_internal/helpers.js';

import {
	dateStore,
	createFormatter,
	getDefaultDate,
	defaultMatcher,
} from '$lib/internal/date/index.js';

const defaults = {
	disabled: defaultMatcher,
	unavailable: defaultMatcher,
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
} satisfies CreateDatePickerProps;

const defaultTriggerAttrs = {
	'data-segment': 'trigger',
};

export function createDatePicker(props?: CreateDatePickerProps) {
	const withDefaults = { ...defaults, ...props };

	const dateField = createDateField({
		...withDefaults,
	});

	const {
		states: { value, placeholderValue: dfPlaceholderValue },
	} = dateField;

	const calendar = createCalendar({
		...withDefaults,
		placeholderValue: dfPlaceholderValue,
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

	const defaultDate = getDefaultDate(get(dateField.options.granularity));
	const formatter = createFormatter(get(locale));

	const placeholderValue = dateStore(
		dfPlaceholderValue,
		withDefaults.defaultPlaceholderValue ?? defaultDate
	);

	effect([locale], ([$locale]) => {
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	effect([open], ([$open]) => {
		if (!$open) {
			const $value = get(value);
			if ($value) {
				placeholderValue.set($value);
			} else {
				placeholderValue.reset();
			}
		}
	});

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			e.preventDefault();
			handleSegmentNavigation(e, dateField.ids.field);
		}
	}

	return {
		elements: {
			...calendar.elements,
			...dateField.elements,
			...popover.elements,
		},
		states: {
			...dateField.states,
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
			dateField: dateField.ids,
			calendar: calendar.ids,
			popover: popover.ids,
		},
	};
}
