import type { DateValue } from '@internationalized/date';
import type {
	DATE_SEGMENT_PARTS,
	NON_EDITABLE_SEGMENT_PARTS,
	EDITABLE_SEGMENT_PARTS as EDITABLE_SEGMENT_PARTS,
	TIME_SEGMENT_PARTS,
} from './parts.js';
import type { Action } from 'svelte/action';
import type { IdObj } from '$lib/internal/helpers/index.js';
import type { DateFieldIdParts } from '../create.js';

export type DateSegmentPart = (typeof DATE_SEGMENT_PARTS)[number];
export type TimeSegmentPart = (typeof TIME_SEGMENT_PARTS)[number];
export type EditableSegmentPart = (typeof EDITABLE_SEGMENT_PARTS)[number];
export type NonEditableSegmentPart = (typeof NON_EDITABLE_SEGMENT_PARTS)[number];
export type SegmentPart = EditableSegmentPart | NonEditableSegmentPart;

export type AnyExceptLiteral = Exclude<SegmentPart, 'literal'>;

export type DayPeriod = 'AM' | 'PM' | null;
export type DateSegmentObj = {
	[K in DateSegmentPart]: number | null;
};
export type TimeSegmentObj = {
	[K in TimeSegmentPart]: K extends 'dayPeriod' ? DayPeriod : number | null;
};
export type DateAndTimeSegmentObj = DateSegmentObj & TimeSegmentObj;
export type SegmentValueObj = DateSegmentObj | DateAndTimeSegmentObj;
export type SegmentContentObj = Record<EditableSegmentPart, string>;

export type SegmentState = {
	lastKeyZero: boolean;
	hasLeftFocus: boolean;
	hasTouched: boolean;
};

export type SegmentStateMap = {
	[K in EditableSegmentPart]: SegmentState;
};

export type SegmentAttrProps = {
	segmentValues: SegmentValueObj;
	hourCycle: 12 | 24 | undefined;
	placeholder: DateValue;
	ids: IdObj<DateFieldIdParts>;
};

export type SegmentAttrFn = (props: SegmentAttrProps) => Record<string, string | number | boolean>;

export type SegmentBuilders = Record<
	EditableSegmentPart | NonEditableSegmentPart,
	{
		attrs: SegmentAttrFn;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		action: Action<any, any, any>;
	}
>;

export type HourCycle = 12 | 24 | undefined;
