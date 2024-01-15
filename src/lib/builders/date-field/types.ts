import type { Writable } from 'svelte/store';
import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
import type { DateFieldIdParts, createDateField } from './create.js';
import type { DateValue } from '@internationalized/date';
import type { Granularity, Matcher } from '$lib/index.js';
import type { EditableSegmentPart } from '$lib/shared/index.js';

export type DateFieldProps = {
	/**
	 * The default value for the date field. When provided,
	 * the `placeholder` will also assume this value.
	 *
	 * @default undefined;
	 */
	defaultValue?: DateValue;

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
	onValueChange?: ChangeFn<DateValue | undefined>;

	/**
	 * A writable store than can be used to control the value of the
	 * date picker from outside the builder. This is useful if you
	 * want to sync the value of the date field with another store
	 * used in your app.
	 *
	 * @default undefined;
	 */
	value?: Writable<DateValue | undefined>;

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
	 */
	placeholder?: Writable<DateValue>;

	/**
	 * A function called when the placeholder value changes. It receives
	 * a single argument, which is an object containing `curr` and
	 * `prev` properties, whose values are the current and previous
	 * values of the `placeholder` store. Whatever you return from this
	 * function will be set as the new value of the `placeholder` store.
	 *
	 * The `placeholder` is kept in sync with the `value` store, so
	 * ensure you know what you're doing if you intend on overriding the
	 * value, as it may render the date field unusable.
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
	 * The minimum acceptable date. When provided, the
	 * date field will become invalid if the user enters
	 * a date before this date.
	 *
	 * @default undefined
	 */
	minValue?: DateValue;

	/**
	 * The maximum acceptable date. When provided, the
	 * date field will become invalid if the user enters
	 * a date after this date.
	 *
	 * @default undefined
	 */
	maxValue?: DateValue;

	/**
	 * If true, the date field will be disabled and users
	 * will not be able to interact with it. This also disables
	 * the hidden input element.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * If true, the date field will be readonly, and users
	 * will not be able to edit the values of any of the
	 * individual segments.
	 *
	 * @default false
	 */
	readonly?: boolean;

	/**
	 *
	 * List of segment names that will be readonly.
	 *
	 * @default undefined
	 */
	readonlySegments?: EditableSegmentPart[];

	/**
	 * The format to use for displaying the time in the input.
	 * If using a 12 hour clock, ensure you also include the
	 * `dayPeriod` segment in your input to ensure the user
	 * can select AM/PM.
	 *
	 * Defaults to the locale's default time format.
	 */
	hourCycle?: 12 | 24;

	/**
	 * The locale to use for formatting the date field.
	 *
	 * @default 'en'
	 */
	locale?: string;

	/**
	 * The granularity of the date field. This determines which
	 * segments will be includes in the segments array used to
	 * build the date field.
	 *
	 * By default, when a `CalendarDate` value is used, the granularity
	 * will default to `'day'`, and when a `CalendarDateTime` or `ZonedDateTime`
	 * value is used, the granularity will default to `'minute'`.
	 *
	 * Granularity is only used for visual purposes, and does not impact
	 * the value of the date field. You can have the same value synced
	 * between multiple date fields with different granularities and they
	 * will all contain the same value.
	 *
	 * @default 'day'
	 */
	granularity?: Granularity;

	/**
	 * Whether or not to hide the timeZoneName segment from the date field.
	 *
	 * @default false;
	 */
	hideTimeZone?: boolean;

	/**
	 * The name to use for the hidden input element of the date field,
	 * which is used to submit the ISO string value of the date field
	 * to a server.
	 *
	 * @default undefined;
	 */
	name?: string;

	/**
	 *
	 * Whether or not the hidden input element of the date field requires
	 * a value to be submitted.
	 *
	 * @default false
	 */
	required?: boolean;

	/**
	 * Override any of the element IDs set by the builder.
	 *
	 * NOTE: you should only use this prop if you know what
	 * you're doing, as it could break the out-of-the-box
	 * accessibility and functionality of the date field if
	 * implemented incorrectly.
	 */
	ids?: Partial<IdObj<DateFieldIdParts>>;
};

export type CreateDateFieldProps = DateFieldProps;
export type DateField = ReturnType<typeof createDateField>;
