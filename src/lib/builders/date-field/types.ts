import type { Granularity, Matcher } from '$lib/index.js';
import type { IdObj, ReadableProp } from '$lib/internal/helpers/index.js';
import type { EditableSegmentPart } from '$lib/shared/index.js';
import type { DateValue } from '@internationalized/date';
import type { DateFieldIdParts, createDateField } from './create.js';

export type DateFieldProps = {
	/**
	 * The value for the date field. When provided,
	 * the `placeholder` will also assume this value.
	 *
	 * @default undefined
	 */
	value?: ReadableProp<DateValue>;

	/**
	 * The date that is used when the date field is empty to
	 * determine what point in time the field should start at.
	 *
	 * @default CalendarDate - the current date at midnight.
	 */
	placeholder?: ReadableProp<DateValue>;

	/**
	 * Any dates that match the provided matchers will be
	 * marked as unavailable, where if selected, the date
	 * field will be marked as invalid.
	 *
	 * @default undefined
	 */
	isDateUnavailable?: ReadableProp<Matcher>;

	/**
	 * The minimum acceptable date. When provided, the
	 * date field will become invalid if the user enters
	 * a date before this date.
	 *
	 * @default undefined
	 */
	minValue?: ReadableProp<DateValue>;

	/**
	 * The maximum acceptable date. When provided, the
	 * date field will become invalid if the user enters
	 * a date after this date.
	 *
	 * @default undefined
	 */
	maxValue?: ReadableProp<DateValue>;

	/**
	 * If true, the date field will be disabled and users
	 * will not be able to interact with it. This also disables
	 * the hidden input element.
	 *
	 * @default false
	 */
	disabled?: ReadableProp<boolean>;

	/**
	 * If true, the date field will be readonly, and users
	 * will not be able to edit the values of any of the
	 * individual segments.
	 *
	 * @default false
	 */
	readonly?: ReadableProp<boolean>;

	/**
	 *
	 * List of segment names that will be readonly.
	 *
	 * @default undefined
	 */
	readonlySegments?: ReadableProp<EditableSegmentPart[]>;

	/**
	 * The format to use for displaying the time in the input.
	 * If using a 12 hour clock, ensure you also include the
	 * `dayPeriod` segment in your input to ensure the user
	 * can select AM/PM.
	 *
	 * Defaults to the locale's default time format.
	 */
	hourCycle?: ReadableProp<12 | 24>;

	/**
	 * The locale to use for formatting the date field.
	 *
	 * @default 'en'
	 */
	locale?: ReadableProp<string>;

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
	granularity?: ReadableProp<Granularity>;

	/**
	 * Whether or not to hide the timeZoneName segment from the date field.
	 *
	 * @default false
	 */
	hideTimeZone?: ReadableProp<boolean>;

	/**
	 * The name to use for the hidden input element of the date field,
	 * which is used to submit the ISO string value of the date field
	 * to a server.
	 *
	 * @default undefined
	 */
	name?: ReadableProp<string>;

	/**
	 *
	 * Whether or not the hidden input element of the date field requires
	 * a value to be submitted.
	 *
	 * @default false
	 */
	required?: ReadableProp<boolean>;

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
