import type { Writable } from 'svelte/store';
import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
import type { DateRangeFieldIdParts, createDateRangeField } from './create.js';
import type { DateValue } from '@internationalized/date';
import type { CreateDateFieldProps, DateFieldIdParts, DateRange, Matcher } from '$lib/index.js';
import type { EditableSegmentPart } from '$lib/shared/index.js';

export type DateRangeFieldProps = {
	/**
	 * The default value for the date field. When provided,
	 * the `placeholder` will also assume this value.
	 *
	 * @default undefined;
	 */
	defaultValue?: DateRange;

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
	onValueChange?: ChangeFn<DateRange>;

	/**
	 * A writable store than can be used to control the value of the
	 * date picker from outside the builder. This is useful if you
	 * want to sync the value of the date field with another store
	 * used in your app.
	 *
	 * @default undefined;
	 */
	value?: Writable<DateRange>;

	/**
	 * The date that is used when the date field is empty to
	 * determine what point in time the field should start at.
	 *
	 * @default CalendarDate - the current date at midnight.
	 */
	defaultPlaceholder?: DateValue;

	/**
	 * A writable store that can be used to control the placeholder
	 * date from outside the builder. When this prop is provided,
	 * the `defaultPlaceholder` prop is ignored, and the value
	 * of this store is used instead.
	 *
	 * The `placeholder` store is not used to set the value of the
	 * date field, it is only used to control the starting point for
	 * the field. The `placeholder` store is used as the starting
	 * point for cycling through the individual date segments.
	 *
	 * @default Writable<CalendarDate> - the current date at midnight.
	 */
	placeholder?: Writable<DateValue>;

	/**
	 * A function called when the placeholder value changes. It receives
	 * a single argument, which is an object containing `curr` and
	 * `prev` properties, whose values are the current and previous
	 * values of the `placeholder` store. Whatever you return from this
	 * function will be set as the new value of the `placeholder` store.
	 *
	 * The `placeholder` is synced with the `value` store, to manage so
	 * internal behavior, so ensure you know what you're doing if you intend
	 * on overriding the value, as it may render the component unusable.
	 *
	 * @default undefined
	 */
	onPlaceholderChange?: ChangeFn<DateValue>;

	/**
	 * Any dates that match the provided matchers will be
	 * marked as unavailable, where if selected, the date
	 * field will be marked as invalid.
	 *
	 * @default undefined;
	 */
	isDateUnavailable?: Matcher;

	/**
	 * @default 'en'
	 */
	locale?: string;

	/**
	 * The value to be used as the `name` attribute for the
	 * `startHiddenInput` element.
	 */
	startName?: string;

	/**
	 * The value to be used as the `name` attribute for the
	 * `endHiddenInput` element.
	 */
	endName?: string;

	/**
	 *
	 * Lists of segment names that will be readonly on the start and end fields.
	 *
	 * @default undefined
	 */
	readonlySegments?: { start: EditableSegmentPart[]; end: EditableSegmentPart[] };

	/**
	 * Override any of the element IDs set by the builder.
	 *
	 * NOTE: you should only use this prop if you know what
	 * you're doing, as it could break the out-of-the-box
	 * accessibility and functionality of the date field if
	 * implemented incorrectly.
	 */
	ids?: Partial<IdObj<DateRangeFieldIdParts>>;
	startIds?: Partial<IdObj<DateFieldIdParts>>;
	endIds?: Partial<IdObj<DateFieldIdParts>>;
};

export type CreateDateRangeFieldProps = Expand<
	DateRangeFieldProps &
		Omit<
			CreateDateFieldProps,
			'value' | 'defaultValue' | 'onValueChange' | 'ids' | 'name' | 'readonlySegments'
		>
>;
export type DateRangeField = ReturnType<typeof createDateRangeField>;
