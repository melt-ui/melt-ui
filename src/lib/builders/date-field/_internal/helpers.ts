import {
	getPlaceholderValue,
	type Formatter,
	type Granularity,
	toDate,
	isZonedDateTime,
	hasTime,
	getSegments,
} from '$lib/internal/helpers/date/index.js';
import type { DateValue } from '@internationalized/date';
import type {
	DateSegmentPart,
	SegmentContentObj,
	EditableSegmentPart,
	SegmentStateMap,
	SegmentValueObj,
	TimeSegmentPart,
	DateAndTimeSegmentObj,
	DayPeriod,
	SegmentPart,
	AnyExceptLiteral,
	HourCycle,
} from './types.js';
import {
	ALL_SEGMENT_PARTS,
	DATE_SEGMENT_PARTS,
	EDITABLE_SEGMENT_PARTS,
	TIME_SEGMENT_PARTS,
} from './parts.js';
import {
	isBrowser,
	isNull,
	generateId,
	kbd,
	isNumberString,
	styleToString,
} from '$lib/internal/helpers/index.js';
import { get, type Writable } from 'svelte/store';
import type { IdObj } from '$lib/internal/types.js';

export function initializeSegmentValues(granularity: Granularity) {
	const calendarDateTimeGranularities = ['hour', 'minute', 'second'];
	const initialParts = EDITABLE_SEGMENT_PARTS.map((part) => {
		if (part === 'dayPeriod') {
			return [part, 'AM'];
		}
		return [part, null];
	}).filter(([key]) => {
		if (key === 'literal' || key === null) return false;
		if (granularity === 'day') {
			return !calendarDateTimeGranularities.includes(key);
		} else {
			return true;
		}
	});
	return Object.fromEntries(initialParts) as SegmentValueObj;
}

type SharedContentProps = {
	granularity: Granularity;
	dateRef: DateValue;
	formatter: Formatter;
	hideTimeZone: boolean;
	hourCycle: HourCycle;
};

type CreateContentObjProps = SharedContentProps & {
	segmentValues: SegmentValueObj;
	locale: string;
};

type CreateContentArrProps = SharedContentProps & {
	contentObj: SegmentContentObj;
};

function createContentObj(props: CreateContentObjProps) {
	const { segmentValues, formatter, locale, dateRef } = props;

	const content = Object.keys(segmentValues).reduce((obj, part) => {
		if (!isSegmentPart(part)) return obj;
		if ('hour' in segmentValues && part === 'dayPeriod') {
			const value = segmentValues[part];
			if (!isNull(value)) {
				obj[part] = value;
			} else {
				obj[part] = getPlaceholderValue(part, 'AM', locale);
			}
		} else {
			obj[part] = getPartContent(part);
		}

		return obj;
	}, {} as SegmentContentObj);

	function getPartContent(part: DateSegmentPart | TimeSegmentPart) {
		if ('hour' in segmentValues) {
			const value = segmentValues[part];
			if (!isNull(value)) {
				return formatter.part(dateRef.set({ [part]: value }), part, {
					hourCycle: props.hourCycle === 24 ? 'h24' : undefined,
				});
			} else {
				return getPlaceholderValue(part, '', locale);
			}
		} else {
			if (isDateSegmentPart(part)) {
				const value = segmentValues[part];
				if (!isNull(value)) {
					return formatter.part(dateRef.set({ [part]: value }), part);
				} else {
					return getPlaceholderValue(part, '', locale);
				}
			}
			return '';
		}
	}

	return content;
}

function createContentArr(props: CreateContentArrProps) {
	const { granularity, dateRef, formatter, contentObj, hideTimeZone, hourCycle } = props;
	const parts = formatter.toParts(dateRef, getOptsByGranularity(granularity, hourCycle));
	const segmentContentArr = parts
		.map((part) => {
			const defaultParts = ['literal', 'dayPeriod', 'timeZoneName', null];

			if (defaultParts.includes(part.type) || !isSegmentPart(part.type)) {
				return {
					part: part.type,
					value: part.value,
				};
			}
			return {
				part: part.type,
				value: contentObj[part.type],
			};
		})
		.filter((segment): segment is { part: SegmentPart; value: string } => {
			if (isNull(segment.part) || isNull(segment.value)) return false;
			if (segment.part === 'timeZoneName' && (!isZonedDateTime(dateRef) || hideTimeZone)) {
				return false;
			}
			return true;
		});
	return segmentContentArr;
}

type CreateContentProps = CreateContentObjProps;

export function createContent(props: CreateContentProps) {
	const contentObj = createContentObj(props);
	const contentArr = createContentArr({
		contentObj,
		...props,
	});
	return {
		obj: contentObj,
		arr: contentArr,
	};
}

function getOptsByGranularity(granularity: Granularity, hourCycle: HourCycle) {
	const opts: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short',
		hourCycle: hourCycle === 24 ? 'h24' : undefined,
		hour12: hourCycle === 24 ? false : undefined,
	};

	if (granularity === 'day') {
		delete opts.second;
		delete opts.hour;
		delete opts.minute;
		delete opts.timeZoneName;
	}
	if (granularity === 'hour') {
		delete opts.minute;
	}
	if (granularity === 'minute') {
		delete opts.second;
	}

	return opts;
}

export function initSegmentStates() {
	return EDITABLE_SEGMENT_PARTS.reduce((acc, key) => {
		acc[key] = {
			lastKeyZero: false,
			hasLeftFocus: true,
			hasTouched: false,
		};
		return acc;
	}, {} as SegmentStateMap);
}

export function initSegmentIds() {
	return Object.fromEntries(
		ALL_SEGMENT_PARTS.map((part) => {
			return [part, generateId()];
		}).filter(([key]) => key !== 'literal')
	) as IdObj<AnyExceptLiteral>;
}

export function isDateSegmentPart(part: unknown): part is DateSegmentPart {
	return DATE_SEGMENT_PARTS.includes(part as DateSegmentPart);
}

export function isSegmentPart(part: string): part is EditableSegmentPart {
	return EDITABLE_SEGMENT_PARTS.includes(part as EditableSegmentPart);
}

export function isAnySegmentPart(part: unknown): part is SegmentPart {
	return ALL_SEGMENT_PARTS.includes(part as EditableSegmentPart);
}

/**
 * Get the segments being used/ are rendered in the DOM.
 * We're using this to determine when to set the value of
 * the date picker, which is when all the segments have
 * been filled.
 */
function getUsedSegments(id: string) {
	if (!isBrowser) return [];
	const usedSegments = getSegments(id)
		.map((el) => el.dataset.segment)
		.filter((part): part is EditableSegmentPart => {
			return EDITABLE_SEGMENT_PARTS.includes(part as EditableSegmentPart);
		});
	return usedSegments;
}

type GetValueFromSegments = {
	segmentObj: SegmentValueObj;
	id: string;
	dateRef: DateValue;
};

export function getValueFromSegments(props: GetValueFromSegments) {
	const { segmentObj, id, dateRef } = props;
	const usedSegments = getUsedSegments(id);
	let date = dateRef;
	usedSegments.forEach((part) => {
		if ('hour' in segmentObj) {
			const value = segmentObj[part];
			if (isNull(value)) return;
			date = date.set({ [part]: segmentObj[part] });
			return;
		} else if (isDateSegmentPart(part)) {
			const value = segmentObj[part];
			if (isNull(value)) return;
			date = date.set({ [part]: segmentObj[part] });
			return;
		}
	});
	return date;
}

/**
 * Check if all the segments being used have been filled.
 * We use this to determine when we should set the value
 * store of the date field(s).
 *
 * @param segmentValues - The current `SegmentValueObj`
 * @param id  - The id of the date field
 */
export function areAllSegmentsFilled(segmentValues: SegmentValueObj, id: string) {
	const usedSegments = getUsedSegments(id);
	return usedSegments.every((part) => {
		if ('hour' in segmentValues) {
			return segmentValues[part] !== null;
		} else if (isDateSegmentPart(part)) {
			return segmentValues[part] !== null;
		}
	});
}

/**
 * Extracts the segment part from the provided node,
 * if it exists, otherwise returns null.
 */
export function getPartFromNode(node: HTMLElement) {
	const part = node.dataset.segment;
	if (!isAnySegmentPart(part)) return null;
	return part;
}

/**
 * Determines if the provided object is a valid `DateAndTimeSegmentObj`
 * by checking if it has the correct keys and values for each key.
 */
export function isDateAndTimeSegmentObj(obj: unknown): obj is DateAndTimeSegmentObj {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	return Object.entries(obj).every(([key, value]) => {
		const validKey =
			TIME_SEGMENT_PARTS.includes(key as TimeSegmentPart) ||
			DATE_SEGMENT_PARTS.includes(key as DateSegmentPart);
		const validValue =
			key === 'dayPeriod'
				? value === 'AM' || value === 'PM' || value === null
				: typeof value === 'number' || value === null;

		return validKey && validValue;
	});
}

/**
 * Infer the granularity to use based on the
 * value and granularity props.
 */
export function inferGranularity(
	value: DateValue,
	granularity: Granularity | undefined
): Granularity {
	if (granularity) {
		return granularity;
	}
	if (hasTime(value)) {
		return 'minute';
	}
	return 'day';
}

export function isAcceptableSegmentKey(key: string) {
	const acceptableSegmentKeys = [
		kbd.ENTER,
		kbd.ARROW_UP,
		kbd.ARROW_DOWN,
		kbd.ARROW_LEFT,
		kbd.ARROW_RIGHT,
		kbd.BACKSPACE,
		kbd.SPACE,
	];
	if (acceptableSegmentKeys.includes(key)) return true;
	if (isNumberString(key)) return true;
	return false;
}

type SyncSegmentValuesProps = {
	value: DateValue;
	updatingDayPeriod: Writable<DayPeriod>;
	segmentValues: Writable<SegmentValueObj>;
	formatter: Formatter;
};

/**
 * Sets the individual segment values based on the current
 * value of the date picker. This is used to initialize the
 * segment values if a default value is provided, and to
 * keep it in sync as the value changes outside the builder.
 */
export function syncSegmentValues(props: SyncSegmentValuesProps) {
	const { value, updatingDayPeriod, segmentValues, formatter } = props;

	const dateValues = DATE_SEGMENT_PARTS.map((part) => {
		return [part, value[part]];
	});
	if ('hour' in value) {
		const timeValues = TIME_SEGMENT_PARTS.map((part) => {
			if (part === 'dayPeriod') {
				const $updatingDayPeriod = get(updatingDayPeriod);
				if ($updatingDayPeriod) {
					return [part, $updatingDayPeriod];
				} else {
					return [part, formatter.dayPeriod(toDate(value))];
				}
			}
			return [part, value[part]];
		});

		const mergedSegmentValues = [...dateValues, ...timeValues];
		segmentValues.set(Object.fromEntries(mergedSegmentValues) as SegmentValueObj);
		updatingDayPeriod.set(null);
		return;
	}

	segmentValues.set(Object.fromEntries(dateValues) as SegmentValueObj);
}

/**
 * Determines if the element with the provided id is the first focusable
 * segment in the date field with the provided fieldId.
 *
 * @param id - The id of the element to check if it's the first segment
 * @param fieldId - The id of the date field associated with the segment
 */
export function isFirstSegment(id: string, fieldId: string) {
	if (!isBrowser) return false;
	const segments = getSegments(fieldId);
	return segments.length ? segments[0].id === id : false;
}

/**
 * Creates or updates a description element for a date field
 * which enables screen readers to read the date field's value.
 *
 * This element is hidden from view, and is portalled to the body
 * so it can be associated via `aria-describedby` and read by
 * screen readers as the user interacts with the date field.
 */
export function setDescription(id: string, formatter: Formatter, value: DateValue) {
	if (!isBrowser) return;
	const valueString = formatter.selectedDate(value);
	const el = document.getElementById(id);
	if (!el) {
		const div = document.createElement('div');
		div.style.cssText = styleToString({
			display: 'none',
		});
		div.id = id;
		div.innerText = `Selected Date: ${valueString}`;
		document.body.appendChild(div);
	} else {
		el.innerText = `Selected Date: ${valueString}`;
	}
}

/**
 * Removes the description element for the date field with
 * the provided ID. This function should be called when the
 * date field is unmounted.
 */
export function removeDescriptionElement(id: string) {
	if (!isBrowser) return;
	const el = document.getElementById(id);
	if (!el) return;
	document.body.removeChild(el);
}
