import { getPlaceholderValue, type Formatter, type Granularity } from '$lib/internal/date';
import type { DateValue } from '@internationalized/date';
import type {
	DateSegmentPart,
	SegmentContent,
	SegmentPart,
	SegmentStateMap,
	SegmentValueObj,
	TimeSegmentPart,
} from './types.js';
import { dateSegmentParts, segmentParts } from './parts.js';
import { generateId } from '$lib/internal/helpers/id.js';
import { isBrowser, isHTMLElement } from '$lib/internal/helpers/is.js';

export function initializeSegmentValues(granularity: Granularity, segmentParts: SegmentPart[]) {
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

type CreateValueContentProps = {
	segmentValues: SegmentValueObj;
	formatter: Formatter;
	locale: string;
	dateRef: DateValue;
};

export function createValueContent(props: CreateValueContentProps) {
	const { segmentValues, formatter, locale, dateRef } = props;

	const content = Object.keys(segmentValues).reduce((obj, part) => {
		if (!isSegmentPart(part)) return obj;
		if ('hour' in segmentValues && part === 'dayPeriod') {
			const value = segmentValues[part];
			const notNull = value !== null;
			if (notNull) {
				obj[part] = `${value}`;
			} else {
				obj[part] = getPlaceholderValue(part, 'AM', locale);
			}
		} else {
			obj[part] = getPartContent(part);
		}

		return obj;
	}, {} as SegmentContent);

	function getPartContent(part: DateSegmentPart | TimeSegmentPart) {
		if ('hour' in segmentValues) {
			const value = segmentValues[part];
			const notNull = value !== null;
			if (notNull) {
				return formatter.part(dateRef.set({ [part]: value }), part);
			} else {
				return getPlaceholderValue(part, '', locale);
			}
		} else {
			if (isDateSegmentPart(part)) {
				const value = segmentValues[part];
				const notNull = value !== null;
				if (notNull) {
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

export function initSegmentStates() {
	return segmentParts.reduce((acc, key) => {
		acc[key] = {
			lastKeyZero: false,
			hasLeftFocus: false,
			hasInitialized: false,
		};
		return acc;
	}, {} as SegmentStateMap);
}

export function initSegmentIds() {
	return Object.fromEntries(
		segmentParts.map((part) => {
			return [part, generateId()];
		})
	) as Record<SegmentPart, string>;
}

function isDateSegmentPart(part: unknown): part is DateSegmentPart {
	return dateSegmentParts.includes(part as DateSegmentPart);
}

export function isSegmentPart(part: string): part is SegmentPart {
	return segmentParts.includes(part as SegmentPart);
}

/**
 * Get the segments being used/ are rendered in the DOM.
 * We're using this to determine when to set the value of
 * the date picker, which is when all the segments have
 * been filled.
 */
export function getUsedSegments(id: string) {
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
export function getSegments(id: string) {
	const inputContainer = document.getElementById(id);
	if (!isHTMLElement(inputContainer)) return [];
	const segments = Array.from(
		inputContainer.querySelectorAll('[data-segment]:not([data-segment="literal"]')
	).filter((el): el is HTMLElement => isHTMLElement(el));
	return segments;
}
