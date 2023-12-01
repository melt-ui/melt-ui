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
import { pickerOpenFocus } from '$lib/internal/helpers/date/focus.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import type { DatePickerEvents } from './events.js';

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
	weekdayFormat: 'narrow',
} satisfies CreateDatePickerProps;

export function createDatePicker(props?: CreateDatePickerProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores(omit(withDefaults, 'value', 'placeholder'));

	const dateField = createDateField(withDefaults);

	const {
		states: { value, placeholder: dfPlaceholder },
	} = dateField;

	const calendar = createCalendar({
		...withDefaults,
		placeholder: dfPlaceholder,
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

	const trigger = builder('popover-trigger', {
		stores: [popover.elements.trigger],
		returned: ([$trigger]) => {
			return {
				...omit($trigger, 'action'),
				'aria-label': 'Open date picker',
				'data-segment': 'trigger',
			};
		},
		action: (node: HTMLElement): MeltActionReturn<DatePickerEvents['trigger']> => {
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
	const formatter = createFormatter(get(options.locale));

	effect([options.locale], ([$locale]) => {
		dateField.options.locale.set($locale);
		calendar.options.locale.set($locale);
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	effect([options.weekdayFormat], ([$weekdayFormat]) => {
		calendar.options.weekdayFormat.set($weekdayFormat);
	});

	effect([options.disabled], ([$disabled]) => {
		dateField.options.disabled.set($disabled);
		calendar.options.disabled.set($disabled);
	});

	effect([options.readonly], ([$readonly]) => {
		dateField.options.readonly.set($readonly);
		calendar.options.readonly.set($readonly);
	});

	effect([options.minValue], ([$minValue]) => {
		dateField.options.minValue.set($minValue);
		calendar.options.minValue.set($minValue);
	});

	effect([options.maxValue], ([$maxValue]) => {
		dateField.options.maxValue.set($maxValue);
		calendar.options.maxValue.set($maxValue);
	});

	const dateFieldOptions = omit(
		dateField.options,
		'locale',
		'disabled',
		'readonly',
		'minValue',
		'maxValue'
	);
	const calendarOptions = omit(
		calendar.options,
		'locale',
		'disabled',
		'readonly',
		'minValue',
		'maxValue'
	);

	const {
		states: { open },
	} = popover;

	const defaultDate = getDefaultDate({
		defaultPlaceholder: withDefaults.defaultPlaceholder,
		defaultValue: withDefaults.defaultValue,
		granularity: withDefaults.granularity,
	});

	const placeholder = dateStore(dfPlaceholder, withDefaults.defaultPlaceholder ?? defaultDate);

	effect([open], ([$open]) => {
		if (!$open) {
			const $value = get(value);
			if ($value) {
				placeholder.set($value);
			} else {
				placeholder.reset();
			}
		}
	});

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			e.preventDefault();
			handleSegmentNavigation(e, get(dateField.ids.field));
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
			placeholder: placeholder.toWritable(),
			value,
			...popover.states,
		},
		helpers: {
			...calendar.helpers,
		},
		options: {
			...dateFieldOptions,
			...calendarOptions,
			...options,
			...popover.options,
		},
		ids: {
			dateField: dateField.ids,
			calendar: calendar.ids,
			popover: popover.ids,
		},
	};
}
