import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { createDateRangeField } from './create.js';
import type { DateValue } from '@internationalized/date';
import type { CreateDateFieldProps, Matcher } from '$lib/index.js';
import type { DateFieldIds } from './_internal/types.js';

type DateRange<T extends DateValue = DateValue> = {
	start?: T;
	end?: T;
};

export type DateRangeFieldProps<T extends DateValue = DateValue> = {
	/**
	 * The default value for the date field. When provided,
	 * the `placeholderValue` will also assume this value.
	 *
	 * @default undefined;
	 */
	defaultValue?: DateRange<T>;

	/**
	 * A function called when the value of the date field changes.
	 * It receives a single argument, which is an object containing
	 * `curr` and `prev` properties, whose values are the current
	 * and previous values of the value store. Whatever you return
	 * from this function will be set as the new value of the value
	 * store.
	 *
	 * @default undefined
	 */
	onValueChange?: ChangeFn<DateRange<T> | undefined>;

	/**
	 * A writable store than can be used to control the value of the
	 * date picker from outside the builder. This is useful if you
	 * want to sync the value of the date field with another store
	 * used in your app.
	 *
	 * @default undefined;
	 */
	value?: Writable<DateRange<T> | undefined>;

	/**
	 * The date that is used when the date field is empty to
	 * determine what point in time the field should start at.
	 *
	 * @default CalendarDate - the current date at midnight.
	 */
	defaultPlaceholderValue?: DateValue;

	/**
	 * A writable store that can be used to control the placeholder
	 * date from outside the builder. When this prop is provided,
	 * the `defaultPlaceholderValue` prop is ignored, and the value
	 * of this store is used instead.
	 *
	 * The `placeholderValue` store is not used to set the value of the
	 * date field, it is only used to control the starting point for
	 * the field. The `placeholderValue` store is used as the starting
	 * point for cycling through the individual date segments.
	 *
	 * @default Writable<CalendarDate> - the current date at midnight.
	 */
	placeholderValue?: Writable<DateValue>;

	/**
	 * A function called when the placeholder value changes. It receives
	 * a single argument, which is an object containing `curr` and
	 * `prev` properties, whose values are the current and previous
	 * values of the `placeholderValue` store. Whatever you return from this
	 * function will be set as the new value of the `placeholderValue` store.
	 *
	 * The `placeholderValue` is kept in sync with the `value` store, so
	 * ensure you know what you're doing if you intend on overriding the
	 * value, as it may render the date field unusable.
	 *
	 * @default undefined
	 */
	onPlaceholderValueChange?: ChangeFn<DateValue>;

	/**
	 * Any dates that match the provided matchers will be
	 * marked as unavailable, where if selected, the date
	 * field will be marked as invalid.
	 *
	 * @default undefined;
	 */
	unavailable?: Matcher | Matcher[];

	/**
	 * @default 'en'
	 */
	locale?: string;

	/**
	 * Override any of the element IDs set by the builder.
	 *
	 * NOTE: you should only use this prop if you know what
	 * you're doing, as it could break the out-of-the-box
	 * accessibility and functionality of the date field if
	 * implemented incorrectly.
	 */
	ids?: Partial<DateFieldIds>;
};

export type { DateFieldIds };
export type CreateDateRangeFieldProps = Expand<
	DateRangeFieldProps &
		Omit<CreateDateFieldProps, 'value' | 'defaultValue' | 'onValueChange' | 'ids'>
>;
export type DateRangeField = ReturnType<typeof createDateRangeField>;
