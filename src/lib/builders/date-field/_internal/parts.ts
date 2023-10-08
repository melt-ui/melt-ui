export const dateSegmentParts = ['day', 'month', 'year'] as const;
export const timeSegmentParts = ['hour', 'minute', 'second', 'dayPeriod'] as const;
export const nonInteractiveSegmentParts = ['literal', 'timeZoneName'] as const;
export const segmentParts = [...dateSegmentParts, ...timeSegmentParts] as const;
export const allSegmentParts = [...segmentParts, ...nonInteractiveSegmentParts] as const;
