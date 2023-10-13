export const DATE_SEGMENT_PARTS = ['day', 'month', 'year'] as const;
export const TIME_SEGMENT_PARTS = ['hour', 'minute', 'second', 'dayPeriod'] as const;
export const NON_EDITABLE_SEGMENT_PARTS = ['literal', 'timeZoneName'] as const;
export const EDITABLE_SEGMENT_PARTS = [...DATE_SEGMENT_PARTS, ...TIME_SEGMENT_PARTS] as const;
export const ALL_SEGMENT_PARTS = [
	...EDITABLE_SEGMENT_PARTS,
	...NON_EDITABLE_SEGMENT_PARTS,
] as const;
