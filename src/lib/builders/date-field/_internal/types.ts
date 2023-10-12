import type { DateValue } from '@internationalized/date';
import type {
	DATE_SEGMENT_PARTS,
	NON_INTERACTIVE_SEGMENT_PARTS,
	INTERACTIVE_SEGMENT_PARTS,
	TIME_SEGMENT_PARTS,
} from './parts.js';
import type { Action } from 'svelte/action';
import type { IdObj } from '$lib/internal/types.js';

export type SegmentPart = (typeof INTERACTIVE_SEGMENT_PARTS)[number];
export type DateSegmentPart = (typeof DATE_SEGMENT_PARTS)[number];
export type TimeSegmentPart = (typeof TIME_SEGMENT_PARTS)[number];
export type NonInteractiveSegmentPart = (typeof NON_INTERACTIVE_SEGMENT_PARTS)[number];
export type AnySegmentPart = SegmentPart | NonInteractiveSegmentPart;

export type AnyExceptLiteral = Exclude<AnySegmentPart, 'literal'>;

export type DayPeriod = 'AM' | 'PM' | null;
export type DateSegmentObj = {
	[K in DateSegmentPart]: number | null;
};
export type TimeSegmentObj = {
	[K in TimeSegmentPart]: K extends 'dayPeriod' ? DayPeriod : number | null;
};
export type DateAndTimeSegmentObj = DateSegmentObj & TimeSegmentObj;
export type SegmentValueObj = DateSegmentObj | DateAndTimeSegmentObj;
export type SegmentContentObj = Record<SegmentPart, string>;

export type SegmentState = {
	lastKeyZero: boolean;
	hasLeftFocus: boolean;
	hasTouched: boolean;
};

export type SegmentStateMap = {
	[K in SegmentPart]: SegmentState;
};

export type SegmentAttrProps = {
	segmentValues: SegmentValueObj;
	hourCycle: 12 | 24 | undefined;
	placeholderValue: DateValue;
};

export type SegmentAttrFn = (props: SegmentAttrProps) => Record<string, string | number | boolean>;

export type SegmentBuilders = Record<
	SegmentPart | NonInteractiveSegmentPart,
	{
		attrs: SegmentAttrFn;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		action: Action<any, any, any>;
	}
>;

export type DateFieldIds = IdObj<AnyExceptLiteral | 'field' | 'label' | 'description'>;

export type HourCycle = 12 | 24 | undefined;
