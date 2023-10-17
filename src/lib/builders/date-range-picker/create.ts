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
		focusTrap: {
			// We want to focus the focused date when the popover
			// is open regardless of the DOM order
			initialFocus: `[data-melt-calendar-cell][data-focused]`,
		},
	});

	const options = toWritableStores({
		...omit(withDefaults, 'value', 'placeholder'),
		...popover.options,
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

	effect([locale], ([$locale]) => {
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
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
		options,
		ids: {
			rangeField: rangeField.ids,
			calendar: calendar.ids,
			popover: popover.ids,
		},
	};
}
