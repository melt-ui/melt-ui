import {
	getPlaceholderValue,
	type Formatter,
	type Granularity,
	toDate,
	isZonedDateTime,
	hasTime,
} from '$lib/internal/date';
import type { DateValue } from '@internationalized/date';
import type {
	DateSegmentPart,
	SegmentContentObj,
	SegmentPart,
	SegmentStateMap,
	SegmentValueObj,
	TimeSegmentPart,
	DateAndTimeSegmentObj,
	DayPeriod,
	AnySegmentPart,
	AnyExceptLiteral,
	HourCycle,
} from './types.js';
import { allSegmentParts, dateSegmentParts, segmentParts, timeSegmentParts } from './parts.js';
import {
	isBrowser,
	isHTMLElement,
	isNull,
	generateId,
	kbd,
	isNumberKey,
	styleToString,
} from '$lib/internal/helpers/index.js';
import { get, type Writable } from 'svelte/store';
import type { IdObj } from '$lib/internal/types.js';

export function initializeSegmentValues(granularity: Granularity) {
	const calendarDateTimeGranularities = ['hour', 'minute', 'second'];
	const initialParts = segmentParts
		.map((part) => {
			if (part === 'dayPeriod') {
				return [part, 'AM'];
			}
			return [part, null];
		})
		.filter(([key]) => {
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

	const parts = formatter.toParts(toDate(dateRef), getOptsByGranularity(granularity, hourCycle));
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
		.filter((segment): segment is { part: AnySegmentPart; value: string } => {
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
	return segmentParts.reduce((acc, key) => {
		acc[key] = {
			lastKeyZero: false,
			hasLeftFocus: false,
			hasTouched: false,
		};
		return acc;
	}, {} as SegmentStateMap);
}

export function initSegmentIds() {
	return Object.fromEntries(
		allSegmentParts
			.map((part) => {
				return [part, generateId()];
			})
			.filter(([key]) => key !== 'literal')
	) as IdObj<AnyExceptLiteral>;
}

export function isDateSegmentPart(part: unknown): part is DateSegmentPart {
	return dateSegmentParts.includes(part as DateSegmentPart);
}

export function isSegmentPart(part: string): part is SegmentPart {
	return segmentParts.includes(part as SegmentPart);
}

export function isAnySegmentPart(part: unknown): part is AnySegmentPart {
	return allSegmentParts.includes(part as SegmentPart);
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
		.filter((part): part is SegmentPart => {
			return segmentParts.includes(part as SegmentPart);
		});
	return usedSegments;
}

/**
 * Gets all the segments in the container with the provided id.
 */
function getSegments(id: string) {
	const inputContainer = document.getElementById(id);
	if (!isHTMLElement(inputContainer)) return [];
	const segments = Array.from(
		inputContainer.querySelectorAll('[data-segment]:not([data-segment="literal"]')
	).filter((el): el is HTMLElement => isHTMLElement(el));
	return segments;
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

export function getPartFromNode(node: HTMLElement) {
	const part = node.dataset.segment;
	if (!isAnySegmentPart(part)) return null;
	return part;
}

export function isDateAndTimeSegmentObj(obj: unknown): obj is DateAndTimeSegmentObj {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	return Object.entries(obj).every(([key, value]) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const validKey = timeSegmentParts.includes(key as any) || dateSegmentParts.includes(key as any);
		const validValue =
			key === 'dayPeriod'
				? value === 'AM' || value === 'PM' || value === null
				: typeof value === 'number' || value === null;

		return validKey && validValue;
	});
}

/**
 * Gets the next segment in the list of segments relative to the provided node.
 */
function getNextSegment(node: HTMLElement, segments: HTMLElement[]) {
	const index = segments.indexOf(node);
	if (index === segments.length - 1 || index === -1) return null;
	const nextIndex = index + 1;
	const nextSegment = segments[nextIndex];
	return nextSegment;
}

/**
 * Gets the prev segment in the list of segments relative to the provided node.
 */
function getPrevSegment(node: HTMLElement, segments: HTMLElement[]) {
	const index = segments.indexOf(node);
	if (index === 0 || index === -1) return null;
	const prevIndex = index - 1;
	const prevSegment = segments[prevIndex];
	return prevSegment;
}

/**
 * Gets an object containing the next and previous segments relative
 * to the provided node.
 */
function getPrevNextSegments(node: HTMLElement, containerId: string) {
	const segments = getSegments(containerId);
	if (!segments.length) {
		return {
			next: null,
			prev: null,
		};
	}
	return {
		next: getNextSegment(node, segments),
		prev: getPrevSegment(node, segments),
	};
}

/**
 * Moves focus to the next segment in the list of segments
 * within the container with the provided id.
 */
export function moveToNextSegment(e: KeyboardEvent, containerId: string) {
	const node = e.currentTarget;
	if (!isHTMLElement(node)) return;
	const { next } = getPrevNextSegments(node, containerId);
	if (!next) return;
	next.focus();
}

export function isSegmentNavigationKey(key: string) {
	if (key === kbd.ARROW_RIGHT || key === kbd.ARROW_LEFT) return true;
	return false;
}

export function handleSegmentNavigation(e: KeyboardEvent, containerId: string) {
	const currentTarget = e.currentTarget;
	if (!isHTMLElement(currentTarget)) return;

	const { prev, next } = getPrevNextSegments(currentTarget, containerId);

	if (e.key === kbd.ARROW_LEFT) {
		if (!prev) return;
		prev.focus();
	} else if (e.key === kbd.ARROW_RIGHT) {
		if (!next) return;
		next.focus();
	}
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
	if (isNumberKey(key)) return true;
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
 * value of the date picker.
 */
export function syncSegmentValues(props: SyncSegmentValuesProps) {
	const { value, updatingDayPeriod, segmentValues, formatter } = props;

	const dateValues = dateSegmentParts.map((part) => {
		return [part, value[part]];
	});
	if ('hour' in value) {
		const timeValues = timeSegmentParts.map((part) => {
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
 * If granularity is undefined, infer it from the provided value.
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

export function removeDescriptionElement(id: string) {
	if (!isBrowser) return;
	const el = document.getElementById(id);
	if (!el) return;
	document.body.removeChild(el);
}
