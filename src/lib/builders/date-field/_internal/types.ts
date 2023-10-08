import type {
	dateSegmentParts,
	nonInteractiveSegmentParts,
	segmentParts,
	timeSegmentParts,
} from './parts.js';

export type SegmentPart = (typeof segmentParts)[number];
export type DateSegmentPart = (typeof dateSegmentParts)[number];
export type TimeSegmentPart = (typeof timeSegmentParts)[number];
export type NonInteractiveSegmentPart = (typeof nonInteractiveSegmentParts)[number];
export type DayPeriod = 'AM' | 'PM' | null;
export type DateSegmentObj = {
	[K in DateSegmentPart]: number | null;
};
export type TimeSegmentObj = {
	[K in TimeSegmentPart]: K extends 'dayPeriod' ? DayPeriod : number | null;
};
export type DateAndTimeSegmentObj = DateSegmentObj & TimeSegmentObj;
export type SegmentValueObj = DateSegmentObj | DateAndTimeSegmentObj;
export type SegmentContent = Record<SegmentPart, string>;

export type SegmentState = {
	lastKeyZero: boolean;
	hasLeftFocus: boolean;
	hasInitialized: boolean;
};

export type SegmentStateMap = {
	[K in SegmentPart]: SegmentState;
};
