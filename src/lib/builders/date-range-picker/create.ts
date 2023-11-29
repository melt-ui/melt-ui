import {
	effect,
	toWritableStores,
	omit,
	builder,
	addMeltEventListener,
} from '$lib/internal/helpers/index.js';
import { get } from 'svelte/store';
import { createRangeCalendar, createPopover } from '$lib/builders/index.js';
import type { CreateDateRangePickerProps } from './types.js';
import {
	handleSegmentNavigation,
	isSegmentNavigationKey,
} from '$lib/internal/helpers/date/index.js';

import { dateStore, createFormatter, getDefaultDate } from '$lib/internal/helpers/date/index.js';
import { createDateRangeField } from '../date-range-field/create.js';
import { pickerOpenFocus } from '$lib/internal/helpers/date/focus.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import type { DateRangePickerEvents } from './events.js';

const defaults = {
	isDateDisabled: undefined,
	isDateUnavailable: undefined,
	value: undefined,
	positioning: {
		placement: 'bottom',
	},
	closeOnEscape: true,
	closeOnOutsideClick: true,
	preventScroll: false,
	forceVisible: false,
	locale: 'en',
	granularity: undefined,
	disabled: false,
	readonly: false,
	minValue: undefined,
	maxValue: undefined,
} satisfies CreateDateRangePickerProps;

export function createDateRangePicker(props?: CreateDateRangePickerProps) {
	const withDefaults = { ...defaults, ...props };

	const rangeField = createDateRangeField(withDefaults);

	const {
		states: { value, placeholder: rfPlaceholder },
	} = rangeField;

	const calendar = createRangeCalendar({
		...withDefaults,
		placeholder: rfPlaceholder,
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
		openFocus: pickerOpenFocus,
	});

	const options = toWritableStores({
		...omit(withDefaults, 'value', 'placeholder'),
	});

	const { locale } = options;

	const defaultDate = getDefaultDate({
		defaultValue: withDefaults.defaultValue?.start,
		defaultPlaceholder: withDefaults.defaultPlaceholder,
		granularity: withDefaults.granularity,
	});

	const formatter = createFormatter(get(locale));

	const placeholder = dateStore(rfPlaceholder, withDefaults.defaultPlaceholder ?? defaultDate);

	const trigger = builder('popover-trigger', {
		stores: [popover.elements.trigger],
		returned: ([$trigger]) => {
			return {
				...omit($trigger, 'action'),
				'aria-label': 'Open date picker',
				'data-segment': 'trigger',
			};
		},
		action: (node: HTMLElement): MeltActionReturn<DateRangePickerEvents['trigger']> => {
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

	effect([options.locale], ([$locale]) => {
		rangeField.options.locale.set($locale);
		calendar.options.locale.set($locale);
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	effect([options.disabled], ([$disabled]) => {
		rangeField.options.disabled.set($disabled);
		calendar.options.disabled.set($disabled);
	});

	effect([options.readonly], ([$readonly]) => {
		rangeField.options.readonly.set($readonly);
		calendar.options.readonly.set($readonly);
	});

	effect([options.minValue], ([$minValue]) => {
		rangeField.options.minValue.set($minValue);
		calendar.options.minValue.set($minValue);
	});

	effect([options.maxValue], ([$maxValue]) => {
		rangeField.options.maxValue.set($maxValue);
		calendar.options.maxValue.set($maxValue);
	});

	effect([popover.states.open], ([$open]) => {
		if (!$open) {
			const $value = get(value);
			if ($value?.start) {
				placeholder.set($value.start);
			} else {
				placeholder.reset();
			}
		}
	});

	const rangeFieldOptions = omit(
		rangeField.options,
		'locale',
		'disabled',
		'readonly',
		'minValue',
		'maxValue'
	);

	const rangeCalendarOptions = omit(
		calendar.options,
		'locale',
		'disabled',
		'readonly',
		'minValue',
		'maxValue'
	);

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			e.preventDefault();
			handleSegmentNavigation(e, get(rangeField.ids.field.field));
		}
	}

	return {
		elements: {
			...calendar.elements,
			...rangeField.elements,
			...popover.elements,
			trigger,
		},
		states: {
			...rangeField.states,
			...calendar.states,
			placeholder: placeholder.toWritable(),
			value,
			...popover.states,
		},
		helpers: {
			...calendar.helpers,
		},
		options: {
			...rangeFieldOptions,
			...rangeCalendarOptions,
			...options,
			...popover.options,
		},
		ids: {
			rangeField: rangeField.ids,
			calendar: calendar.ids,
			popover: popover.ids,
		},
	};
}
