import type { DateValue } from '@internationalized/date';
import type { CreateDateFieldProps } from './types';
import {
	builder,
	createElHelpers,
	effect,
	generateId,
	kbd,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers';
import { omit } from '../../internal/helpers/object';
import { dateStore, getDefaultDate } from '$lib/internal/date';
import { get, writable } from 'svelte/store';
import { createFormatter } from '../date-picker/formatter';
import { initSegmentIds, initSegmentStates } from './_internal/helpers';

const defaults = {
	unavailable: false,
	value: undefined,
	hourCycle: 24,
	locale: 'en',
	granularity: 'day',
} satisfies CreateDateFieldProps;

type DateFieldParts = 'segment';

const { name } = createElHelpers<DateFieldParts>('dateField');

const acceptableSegmentKeys = [
	kbd.ENTER,
	kbd.ARROW_UP,
	kbd.ARROW_DOWN,
	kbd.ARROW_LEFT,
	kbd.ARROW_RIGHT,
	kbd.BACKSPACE,
	kbd.SPACE,
];

export function createDateField<T extends DateValue = DateValue>(props?: CreateDateFieldProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores(omit(withDefaults, 'value', 'placeholderValue'));
	const { locale, granularity, hourCycle, unavailable } = options;

	const defaultDate = getDefaultDate(withDefaults.granularity);
	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const placeholderValueWritable =
		withDefaults.placeholderValue ?? writable(withDefaults.placeholderValue ?? defaultDate);
	const placeholderValue = dateStore(
		overridable(placeholderValueWritable, withDefaults.onPlaceholderValueChange),
		withDefaults.defaultPlaceholderValue ?? defaultDate
	);

	const formatter = createFormatter(get(locale));

	const ids = {
		...initSegmentIds(),
		field: generateId(),
	};

	const states = initSegmentStates();

	const dateField = builder(name(), {
		returned: () => {
			return {
				role: 'group',
				id: ids.field,
			};
		},
	});

	const dateValue = get(placeholderValue);

	effect(locale, ($locale) => {
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	effect(value, ($value) => {
		if ($value && get(placeholderValue) !== $value) {
			placeholderValue.set($value);
		}
	});
}
