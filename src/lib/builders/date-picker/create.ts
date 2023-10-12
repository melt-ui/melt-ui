import {
	effect,
	toWritableStores,
	omit,
	builder,
	addMeltEventListener,
} from '$lib/internal/helpers/index.js';
import { get } from 'svelte/store';
import { createCalendar, createDateField, createPopover } from '$lib/builders/index.js';
import type { CreateDatePickerProps } from './types.js';
import {
	handleSegmentNavigation,
	isSegmentNavigationKey,
} from '$lib/internal/helpers/date/index.js';

import { dateStore, createFormatter, getDefaultDate } from '$lib/internal/helpers/date/index.js';

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
} satisfies CreateDatePickerProps;

export function createDatePicker(props?: CreateDatePickerProps) {
	const withDefaults = { ...defaults, ...props };

	const dateField = createDateField(withDefaults);

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
		focusTrap: {
			// We want to focus the focused date when the popover
			// is open regardless of the DOM order
			initialFocus: `[data-melt-calendar-cell][data-focused]`,
		},
	});

	const trigger = builder('popover-trigger', {
		stores: [popover.elements.trigger],
		returned: ([$trigger]) => {
			return {
				...omit($trigger, 'action'),
				'aria-label': 'Open date picker',
				'data-segment': 'trigger',
			};
		},
		action: (node: HTMLElement) => {
			const unsubKeydown = addMeltEventListener(node, 'keydown', handleTriggerKeydown);

			const { destroy } = popover.elements.trigger(node);

			return {
				destroy() {
					destroy?.();
					unsubKeydown();
				},
			};
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
		defaultPlaceholderValue: withDefaults.defaultPlaceholderValue,
		defaultValue: withDefaults.defaultValue,
		granularity: withDefaults.granularity,
	});
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
			trigger,
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