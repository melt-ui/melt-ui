import {
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	isBrowser,
	isHTMLElement,
	kbd,
	styleToString,
} from '$lib/internal/helpers/index.js';
import type { _DatePickerParts, _DatePickerIds, _DatePickerStores } from './create.js';
import { get, writable, type Updater, type Writable, derived } from 'svelte/store';
import type { Action } from 'svelte/action';
import type { createFormatter } from './formatter.js';
import {
	getLocalTimeZone,
	type DateValue,
	ZonedDateTime,
	CalendarDateTime,
} from '@internationalized/date';
import { getDaysInMonth } from './utils.js';
import { getPlaceholderValue } from './placeholders.js';
import type { Granularity } from './types.js';

const { name } = createElHelpers<_DatePickerParts>('calendar');

/**
 * The default attributes applied to each segment
 */
const segmentDefaults = {
	role: 'spinbutton',
	contenteditable: true,
	tabindex: 0,
	spellcheck: false,
	inputmode: 'numeric',
	autocorrect: 'off',
	enterkeyhint: 'next',
	style: styleToString({
		'caret-color': 'transparent',
	}),
};

type CreateSegmentProps = {
	stores: _DatePickerStores;
	ids: _DatePickerIds;
	options: {
		hourCycle: Writable<12 | 24 | undefined>;
	};
	formatter: ReturnType<typeof createFormatter>;
};

const dateSegmentParts = ['day', 'month', 'year'] as const;
const timeSegmentParts = ['hour', 'minute', 'second', 'dayPeriod'] as const;

const segmentParts = [...dateSegmentParts, ...timeSegmentParts] as const;

type SegmentPart = (typeof segmentParts)[number];
type DateSegmentPart = (typeof dateSegmentParts)[number];
type TimeSegmentPart = (typeof timeSegmentParts)[number];

type DateSegmentObj = {
	[K in DateSegmentPart]: number | null;
};
type TimeSegmentObj = {
	[K in TimeSegmentPart as K]: K extends 'dayPeriod' ? DayPeriod : number | null;
};
type DateAndTimeSegmentObj = DateSegmentObj & TimeSegmentObj;
type SegmentValueObj = DateSegmentObj | DateAndTimeSegmentObj;

type SegmentState = {
	lastKeyZero: boolean;
	hasLeftFocus: boolean;
	hasInitialized: boolean;
	hasTouched: boolean;
};

type SegmentStates = {
	[K in SegmentPart]: SegmentState;
};

type DayPeriod = 'AM' | 'PM' | null;

const acceptableSegmentKeys = [
	kbd.ENTER,
	kbd.ARROW_UP,
	kbd.ARROW_DOWN,
	kbd.ARROW_LEFT,
	kbd.ARROW_RIGHT,
	kbd.BACKSPACE,
	kbd.SPACE,
];

type SegmentContent = Record<SegmentPart, string>;

export function createSegments(props: CreateSegmentProps) {
	const { stores, ids, options, formatter } = props;

	/**
	 * State for each segment used to better handle certain
	 * events and key presses within each segment.
	 */
	const states = segmentParts.reduce((acc, key) => {
		acc[key] = {
			lastKeyZero: false,
			hasLeftFocus: false,
			hasInitialized: false,
			hasTouched: false,
		};
		return acc;
	}, {} as SegmentStates);

	const { value, locale, granularity, placeholderValue } = stores;
	const { hourCycle } = options;

	const dateNow = get(placeholderValue);
	const initialSegments = initializeSegmentValues(get(granularity));
	const segmentValues = writable(structuredClone(initialSegments));

	/**
	 * Prevent a condition where the value of the date
	 * overrides the updated dayPeriod value when all
	 * segments are filled.
	 */
	let updatingDayPeriod: 'AM' | 'PM' | null = null;

	const segmentContents = derived(
		[segmentValues, locale, granularity],
		([$segmentValues, $locale, $granularity]) => {
			const valueContents = Object.keys($segmentValues).reduce((obj, part) => {
				if (!isSegmentPart(part)) return obj;
				if (part === 'day') {
					const value = $segmentValues[part];
					const notNull = value !== null;
					if (notNull) {
						obj[part] = formatter.part(dateNow.set({ day: value }), part);
					} else {
						obj[part] = getPlaceholderValue(part, '', $locale);
					}
				} else if (part === 'month') {
					const value = $segmentValues[part];
					const notNull = value !== null;
					if (notNull) {
						obj[part] = formatter.part(dateNow.set({ month: value }), part);
					} else {
						obj[part] = getPlaceholderValue(part, '', $locale);
					}
				} else if (part === 'year') {
					const value = $segmentValues[part];
					const notNull = value !== null;
					if (notNull) {
						obj[part] = formatter.part(dateNow.set({ year: value }), part);
					} else {
						obj[part] = getPlaceholderValue(part, '', $locale);
					}
				}
				if ('hour' in $segmentValues) {
					if (part === 'hour') {
						const value = $segmentValues[part];
						const notNull = value !== null;
						if (notNull) {
							obj[part] = formatter.part(dateNow.set({ hour: value }), part);
						} else {
							obj[part] = getPlaceholderValue(part, '', $locale);
						}
					} else if (part === 'minute') {
						const value = $segmentValues[part];
						const notNull = value !== null;
						if (notNull) {
							obj[part] = formatter.part(dateNow.set({ minute: value }), part);
						} else {
							obj[part] = getPlaceholderValue(part, '', $locale);
						}
					} else if (part === 'second') {
						const value = $segmentValues[part];
						const notNull = value !== null;
						if (notNull) {
							obj[part] = formatter.part(dateNow.set({ second: value }), part);
						} else {
							obj[part] = getPlaceholderValue(part, '', $locale);
						}
					} else if (part === 'dayPeriod') {
						const value = $segmentValues[part];
						const notNull = value !== null;
						if (notNull) {
							obj[part] = `${value}`;
						} else {
							obj[part] = getPlaceholderValue(part, 'AM', $locale);
						}
					}
				}

				return obj;
			}, {} as SegmentContent);

			const segmentContent = initializeContentSegments($granularity)
				.map(([part, value]) => {
					if (part === null || !isSegmentPart(part)) {
						return {
							part,
							value,
						};
					}
					return {
						part,
						value: valueContents[part],
					};
				})
				.filter((segment): segment is { part: SegmentPart | 'literal'; value: string } => {
					if (segment.part === null || segment.value === null) return false;
					return true;
				});

			return {
				arr: segmentContent,
				obj: valueContents,
			};
		}
	);

	/**
	 * Sets the individual segment values based on the current
	 * value of the date picker.
	 */
	function syncSegmentValues(value: DateValue) {
		const dateValues = dateSegmentParts.map((part) => {
			return [part, value[part]];
		});
		if ('hour' in value) {
			const timeValues = timeSegmentParts.map((part) => {
				if (part === 'dayPeriod') {
					if (updatingDayPeriod) {
						return [part, updatingDayPeriod];
					} else {
						return [part, formatter.dayPeriod(toDate(value))];
					}
				}
				return [part, value[part]];
			});

			const mergedSegmentValues = [...dateValues, ...timeValues];
			segmentValues.set(Object.fromEntries(mergedSegmentValues) as SegmentValueObj);
			updatingDayPeriod = null;
			return;
		}

		segmentValues.set(Object.fromEntries(dateValues) as SegmentValueObj);
	}

	/**
	 * Get the segments being used/ are rendered in the DOM.
	 * We're using this to determine when to set the value of
	 * the date picker, which is when all the segments have
	 * been filled.
	 */
	function getUsedSegments() {
		if (!isBrowser) return [];
		const usedSegments = getSegments(ids.field)
			.map((el) => el.dataset.segment)
			.filter((part): part is SegmentPart => {
				return segmentParts.includes(part as SegmentPart);
			});
		return usedSegments;
	}

	function getPartFromNode(node: HTMLElement) {
		const part = node.dataset.segment;
		if (!part) return null;
		return part as SegmentPart;
	}

	/**
	 * Constructs a new date object based on the current
	 * values of the used segments, and sets the value
	 * store to that new date.
	 */
	function setValueFromSegments(segmentObj: SegmentValueObj) {
		const usedSegments = getUsedSegments();
		let date = dateNow;
		usedSegments.forEach((part) => {
			if (part === 'day') {
				const day = segmentObj[part];
				if (day === null) return;
				date = date.set({ day });
				return;
			} else if (part === 'month') {
				const month = segmentObj[part];
				if (month === null) return;
				date = date.set({ month });
				return;
			} else if (part === 'year') {
				const year = segmentObj[part];
				if (year === null) return;
				date = date.set({ year });
				return;
			}

			if ('hour' in segmentObj) {
				if (part === 'minute' || part === 'second') {
					const partValue = segmentObj[part];
					if (partValue === null) return;
					date = date.set({ [part]: partValue });
					return;
				}
				if (part === 'hour') {
					const partValue = segmentObj[part];
					if (partValue === null) return;
					date = date.set({ [part]: partValue });
					return;
				}
			}
		});

		return value.set(date);
	}

	function areAllSegmentsFilled() {
		const usedSegments = getUsedSegments();
		const $segmentValues = get(segmentValues);
		return usedSegments.every((part) => {
			if ('hour' in $segmentValues) {
				return $segmentValues[part] !== null;
			} else if (part === 'day' || part === 'month' || part === 'year') {
				return $segmentValues[part] !== null;
			}
		});
	}

	function updateSegment<T extends keyof DateAndTimeSegmentObj>(
		part: T,
		cb: T extends DateSegmentPart
			? Updater<DateSegmentObj[T]>
			: T extends TimeSegmentPart
			? Updater<TimeSegmentObj[T]>
			: Updater<DateAndTimeSegmentObj[T]>
	) {
		segmentValues.update((prev) => {
			if (isDateAndTimeSegmentObj(prev)) {
				const pVal = prev[part];
				const castCb = cb as Updater<DateAndTimeSegmentObj[T]>;
				if (part === 'month') {
					const next = castCb(pVal) as DateAndTimeSegmentObj['month'];
					if (part === 'month' && next !== null && prev.day !== null) {
						const date = dateNow.set({ month: next });
						const daysInMonth = getDaysInMonth(toDate(date));
						if (prev.day > daysInMonth) {
							prev.day = daysInMonth;
						}
					}
					return {
						...prev,
						[part]: next,
					};
				} else if (part === 'dayPeriod') {
					const next = castCb(pVal) as DateAndTimeSegmentObj['dayPeriod'];
					updatingDayPeriod = next;
					const date = get(placeholderValue);
					if (hasTime(date)) {
						const trueHour = date.hour;
						if (next === 'AM') {
							if (trueHour >= 12) {
								prev.hour = trueHour - 12;
							}
						} else if (next === 'PM') {
							if (trueHour < 12) {
								prev.hour = trueHour + 12;
							}
						}
					}

					return {
						...prev,
						[part]: next,
					};
				} else if (part === 'hour') {
					const next = castCb(pVal) as DateAndTimeSegmentObj['hour'];
					if (next !== null && prev.dayPeriod !== null) {
						const dayPeriod = formatter.dayPeriod(toDate(dateNow.set({ hour: next })));
						if (dayPeriod === 'AM' || dayPeriod === 'PM') {
							prev.dayPeriod = dayPeriod;
						}
					}
					return {
						...prev,
						[part]: next,
					};
				}

				const next = castCb(pVal);
				return {
					...prev,
					[part]: next,
				};
			} else if (isDateSegmentPart(part)) {
				const pVal = prev[part];
				const castCb = cb as Updater<DateSegmentObj[DateSegmentPart]>;
				const next = castCb(pVal);
				if (part === 'month' && next !== null && prev.day !== null) {
					const date = dateNow.set({ month: next });
					const daysInMonth = getDaysInMonth(toDate(date));
					if (prev.day > daysInMonth) {
						prev.day = daysInMonth;
					}
				}
				return {
					...prev,
					[part]: next,
				};
			}

			return prev;
		});
		const $segmentValues = get(segmentValues);
		if (areAllSegmentsFilled()) {
			setValueFromSegments($segmentValues);
			updatingDayPeriod = null;
		}
	}

	const segmentBuilders: SegmentBuilders = {
		day: {
			attrs: daySegmentAttrs,
			action: daySegmentAction,
		},
		month: {
			attrs: monthSegmentAttrs,
			action: monthSegmentAction,
		},
		year: {
			attrs: yearSegmentAttrs,
			action: yearSegmentAction,
		},
		hour: {
			attrs: hourSegmentAttrs,
			action: hourSegmentAction,
		},
		minute: {
			attrs: minuteSegmentAttrs,
			action: minuteSegmentAction,
		},
		second: {
			attrs: secondSegmentAttrs,
			action: secondSegmentAction,
		},
		dayPeriod: {
			attrs: dayPeriodSegmentAttrs,
			action: dayPeriodSegmentAction,
		},
		literal: {
			attrs: literalSegmentAttrs,
			action: literalSegmentAction,
		},
		timeZoneName: {
			attrs: timeZoneSegmentAttrs,
			action: timeZoneSegmentAction,
		},
	};

	effect([value, locale], ([$value, _]) => {
		// using `locale` as a dep so that we can reconvert
		// when using a different hour cycle
		if ($value) {
			syncSegmentValues($value);
		} else {
			segmentValues.set(structuredClone(initialSegments));
		}
	});

	const segment = builder(name('segment'), {
		stores: [segmentValues, hourCycle, placeholderValue, locale],
		returned: ([$segmentValues, $hourCycle, $placeholderValue, _]) => {
			const props = {
				$segmentValues,
				$hourCycle,
				$placeholderValue,
			};
			return (part: SegmentPart | 'literal') => ({
				...getSegmentAttrs(part, props),
				'data-segment': part,
			});
		},
		action: (node: HTMLElement) => getSegmentAction(node),
	});

	type SegmentAttrFn = (props: SegmentAttrProps) => Record<string, string | number | boolean>;

	type SegmentBuilders = Record<
		SegmentPart | 'literal' | 'timeZoneName',
		{
			attrs: SegmentAttrFn;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			action: Action<any, any, any>;
		}
	>;

	type SegmentAttrProps = {
		$segmentValues: SegmentValueObj;
		$hourCycle: 12 | 24 | undefined;
		$placeholderValue: DateValue;
	};

	function getSegmentAttrs(
		part: SegmentPart | 'literal' | 'timeZoneName',
		props: SegmentAttrProps
	) {
		return segmentBuilders[part].attrs(props);
	}

	function getSegmentAction(node: HTMLElement) {
		const part = getPartFromNode(node);
		if (!part) throw new Error('No segment part found');
		return segmentBuilders[part].action(node);
	}

	/*
	 * ---------------------------------------------------------------------------------------------
	 *
	 * DAY SEGMENT
	 *
	 * ---------------------------------------------------------------------------------------------
	 */

	function daySegmentAttrs(props: SegmentAttrProps) {
		const { $segmentValues, $placeholderValue } = props;
		const isEmpty = $segmentValues.day === null;
		const date = $segmentValues.day
			? $placeholderValue.set({ day: $segmentValues.day })
			: $placeholderValue;

		const valueNow = date.day;
		const valueMin = 1;
		const valueMax = getDaysInMonth(toDate(date));
		const valueText = isEmpty ? 'Empty' : `${valueNow}`;

		return {
			...segmentDefaults,
			id: ids.daySegment,
			'aria-label': 'day, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function daySegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', handleDaySegmentKeydown),
			addMeltEventListener(node, 'focusout', () => (states.day.hasLeftFocus = true))
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleDaySegmentKeydown(e: KeyboardEvent) {
		if (!isTabKey(e.key)) {
			e.preventDefault();
		}
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		const $segmentMonthValue = get(segmentValues).month;

		const daysInMonth = $segmentMonthValue
			? getDaysInMonth(toDate(dateNow.set({ month: $segmentMonthValue })))
			: getDaysInMonth(toDate(dateNow));

		if (e.key === kbd.ARROW_UP) {
			updateSegment('day', (prev) => {
				if (prev === null) {
					return 1;
				}
				return dateNow.set({ day: prev }).cycle('day', 1).day;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('day', (prev) => {
				if (prev === null || prev === 1) {
					return daysInMonth;
				}
				return dateNow.set({ day: prev }).cycle('day', -1).day;
			});
			return;
		}

		if (isNumberKey(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('day', (prev) => {
				const max = daysInMonth;
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.day.hasLeftFocus) {
					prev = null;
					states.day.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.day.lastKeyZero = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (states.day.lastKeyZero || num > maxStart) {
						moveToNext = true;
						return num;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit (0-3 in most months), and if so, we're
					 * going to move to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}

					return num;
				}
				moveToNext = true;

				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, ids.field);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			const currentTarget = e.currentTarget;
			if (!isHTMLElement(currentTarget)) return;

			updateSegment('day', (prev) => {
				if (prev === null) return null;
				const str = prev.toString();
				if (str.length === 1) return null;
				return parseInt(str.slice(0, -1));
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, ids.field);
		}
	}

	/*
	 * ---------------------------------------------------------------------------------------------
	 *
	 * MONTH SEGMENT
	 *
	 * ---------------------------------------------------------------------------------------------
	 */

	function monthSegmentAttrs(props: SegmentAttrProps) {
		const { $segmentValues, $placeholderValue } = props;
		const isEmpty = $segmentValues.month === null;
		const date = $segmentValues.month
			? $placeholderValue.set({ month: $segmentValues.month - 1 })
			: $placeholderValue;
		const valueNow = date.month + 1;
		const valueMin = 1;
		const valueMax = 12;
		const valueText = isEmpty ? 'Empty' : `${valueNow} - ${formatter.fullMonth(toDate(date))}`;

		return {
			...segmentDefaults,
			id: ids.monthSegment,
			'aria-label': 'month, ',
			contenteditable: true,
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function monthSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', handleMonthSegmentKeydown),
			addMeltEventListener(node, 'focusout', () => (states.month.hasLeftFocus = true))
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleMonthSegmentKeydown(e: KeyboardEvent) {
		if (!isTabKey(e.key)) {
			e.preventDefault();
		}

		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		const max = 12;

		states.month.hasTouched = true;

		if (e.key === kbd.ARROW_UP) {
			updateSegment('month', (prev) => {
				if (prev === null) {
					return 0;
				}
				const next = dateNow.set({ month: prev }).cycle('month', 1).month;
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('month', (prev) => {
				if (prev === null) {
					return 11;
				}
				return dateNow.set({ month: prev }).cycle('month', -1).month;
			});
			return;
		}

		if (isNumberKey(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('month', (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.month.hasLeftFocus) {
					prev = null;
					states.month.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.month.lastKeyZero = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (1), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (states.month.lastKeyZero || num > maxStart) {
						moveToNext = true;
						return num;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit (0-3 in most months), and if so, we're
					 * going to move to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}

					return num;
				}
				moveToNext = true;

				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, ids.field);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			states.month.hasLeftFocus = false;
			updateSegment('month', (prev) => {
				if (prev === null) return null;
				const str = prev.toString();
				if (str.length === 1) return null;
				return parseInt(str.slice(0, -1));
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, ids.field);
		}
	}

	/*
	 * ---------------------------------------------------------------------------------------------
	 *
	 * YEAR SEGMENT
	 *
	 * ---------------------------------------------------------------------------------------------
	 */

	function yearSegmentAttrs(props: SegmentAttrProps) {
		const { $segmentValues } = props;
		const isEmpty = $segmentValues.year === null;
		const date = $segmentValues.year ? dateNow.set({ year: $segmentValues.year }) : dateNow;
		const valueMin = 1;
		const valueMax = 9999;
		const valueNow = date.year;
		const valueText = isEmpty ? 'Empty' : `${valueNow}`;

		return {
			...segmentDefaults,
			id: ids.yearSegment,
			'aria-label': 'year, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function yearSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', handleYearSegmentKeydown),
			addMeltEventListener(node, 'focusout', () => (states.year.hasLeftFocus = true))
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleYearSegmentKeydown(e: KeyboardEvent) {
		if (!isTabKey(e.key)) {
			e.preventDefault();
		}
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		states.year.hasTouched = true;

		const min = 0;
		const currentYear = dateNow.year;

		if (e.key === kbd.ARROW_UP) {
			updateSegment('year', (prev) => {
				if (prev === null) return currentYear;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('year', (prev) => {
				if (prev === null || prev === min) {
					return currentYear;
				}
				return prev - 1;
			});
			return;
		}

		if (isNumberKey(e.key)) {
			let moveToNext = false;
			const num = parseInt(e.key);
			updateSegment('year', (prev) => {
				if (states.year.hasLeftFocus) {
					prev = null;
					states.year.hasLeftFocus = false;
				}

				if (prev === null) {
					return num;
				}
				const str = prev.toString() + num.toString();
				if (str.length > 4) return num;
				if (str.length === 4) {
					moveToNext = true;
				}

				const int = parseInt(str);

				return int;
			});

			if (moveToNext) {
				moveToNextSegment(e, ids.field);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			updateSegment('year', (prev) => {
				if (prev === null) return null;
				const str = prev.toString();
				if (str.length === 1) return null;
				return parseInt(str.slice(0, -1));
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, ids.field);
		}
	}

	/*
	 * ---------------------------------------------------------------------------------------------
	 *
	 * HOUR SEGMENT
	 *
	 * ---------------------------------------------------------------------------------------------
	 */

	function hourSegmentAttrs(props: SegmentAttrProps) {
		const { $segmentValues, $hourCycle, $placeholderValue } = props;
		if (!('hour' in $segmentValues) || !('hour' in $placeholderValue)) return {};
		const isEmpty = $segmentValues.hour === null;
		const date = $segmentValues.hour
			? $placeholderValue.set({ hour: $segmentValues.hour })
			: $placeholderValue;
		const valueMin = $hourCycle === 12 ? 1 : 0;
		const valueMax = $hourCycle === 12 ? 12 : 23;
		const valueNow = date.hour;
		const valueText = isEmpty ? 'Empty' : `${valueNow} ${$segmentValues.dayPeriod ?? ''}`;

		return {
			...segmentDefaults,
			id: ids.hourSegment,
			'aria-label': 'hour, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function hourSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', handleHourSegmentKeydown),
			addMeltEventListener(node, 'focusout', () => (states.hour.hasLeftFocus = true))
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleHourSegmentKeydown(e: KeyboardEvent) {
		if (!isTabKey(e.key)) {
			e.preventDefault();
		}

		if (!isAcceptableSegmentKey(e.key) || !('hour' in dateNow)) {
			return;
		}

		states.hour.hasTouched = true;

		const min = get(hourCycle) === 12 ? 1 : 0;
		const max = get(hourCycle) === 12 ? 12 : 23;

		if (e.key === kbd.ARROW_UP) {
			updateSegment('hour', (prev) => {
				if (prev === null) return min;
				const next = dateNow.set({ hour: prev }).cycle('hour', 1).hour;
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('hour', (prev) => {
				if (prev === null) {
					return max;
				}
				const next = dateNow.set({ hour: prev }).cycle('hour', -1).hour;
				return next;
			});
			return;
		}

		if (isNumberKey(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('hour', (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.hour.hasLeftFocus) {
					prev = null;
					states.hour.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.hour.lastKeyZero = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (states.hour.lastKeyZero || num > maxStart) {
						moveToNext = true;
						return num;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value, then we will
				 * reset the segment as if the user had pressed the backspace key and then
				 * typed a number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit, and if so, we're moving to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}

					return num;
				}
				moveToNext = true;

				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, ids.field);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			states.hour.hasLeftFocus = false;
			updateSegment('hour', (prev) => {
				if (prev === null) return null;
				const str = prev.toString();
				if (str.length === 1) return null;
				return parseInt(str.slice(0, -1));
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, ids.field);
		}
	}

	/*
	 * ---------------------------------------------------------------------------------------------
	 *
	 * MINUTE SEGMENT
	 *
	 * ---------------------------------------------------------------------------------------------
	 */

	function minuteSegmentAttrs(props: SegmentAttrProps) {
		const { $segmentValues, $placeholderValue } = props;
		if (!('minute' in $segmentValues) || !('minute' in $placeholderValue)) return {};
		const isEmpty = $segmentValues.minute === null;
		const date = $segmentValues.minute
			? $placeholderValue.set({ minute: $segmentValues.minute })
			: $placeholderValue;
		const valueNow = date.minute;
		const valueMin = 0;
		const valueMax = 59;
		const valueText = isEmpty ? 'Empty' : `${valueNow}`;

		return {
			...segmentDefaults,
			id: ids.minuteSegment,
			'aria-label': 'minute, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function minuteSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', handleMinuteSegmentKeydown),
			addMeltEventListener(node, 'focusout', () => (states.minute.hasLeftFocus = true))
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleMinuteSegmentKeydown(e: KeyboardEvent) {
		if (!isTabKey(e.key)) {
			e.preventDefault();
		}
		if (!isAcceptableSegmentKey(e.key) || !('minute' in dateNow)) {
			return;
		}

		states.minute.hasTouched = true;

		const min = 0;
		const max = 59;

		if (e.key === kbd.ARROW_UP) {
			updateSegment('minute', (prev) => {
				if (prev === null) {
					return min;
				}
				const next = dateNow.set({ minute: prev }).cycle('minute', 1).minute;
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('minute', (prev) => {
				if (prev === null) {
					return max;
				}
				const next = dateNow.set({ minute: prev }).cycle('minute', -1).minute;
				return next;
			});
			return;
		}

		if (isNumberKey(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('minute', (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.minute.hasLeftFocus) {
					prev = null;
					states.minute.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.minute.lastKeyZero = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (states.minute.lastKeyZero || num > maxStart) {
						moveToNext = true;
						return num;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value, then we will
				 * reset the segment as if the user had pressed the backspace key and then
				 * typed a number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit, and if so, we're moving to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}

					return num;
				}
				moveToNext = true;

				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, ids.field);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			states.minute.hasLeftFocus = false;
			updateSegment('minute', (prev) => {
				if (prev === null) return null;
				const str = prev.toString();
				if (str.length === 1) return null;
				return parseInt(str.slice(0, -1));
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, ids.field);
		}
	}

	/*
	 * ---------------------------------------------------------------------------------------------
	 *
	 * SECOND SEGMENT
	 *
	 * ---------------------------------------------------------------------------------------------
	 */

	function secondSegmentAttrs(props: SegmentAttrProps) {
		const { $segmentValues, $placeholderValue } = props;
		if (!('second' in $segmentValues) || !('second' in $placeholderValue)) return {};
		const isEmpty = $segmentValues.second === null;
		const date = $segmentValues.second
			? $placeholderValue.set({ second: $segmentValues.second })
			: $placeholderValue;
		const valueNow = date.second;
		const valueMin = 0;
		const valueMax = 59;
		const valueText = isEmpty ? 'Empty' : `${valueNow}`;

		return {
			...segmentDefaults,
			id: ids.secondSegment,
			'aria-label': 'second, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function secondSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', handleSecondSegmentKeydown),
			addMeltEventListener(node, 'focusout', () => (states.second.hasLeftFocus = true))
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleSecondSegmentKeydown(e: KeyboardEvent) {
		if (!isTabKey(e.key)) {
			e.preventDefault();
		}
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		states.second.hasTouched = true;

		const min = 0;
		const max = 59;

		if (!('second' in dateNow)) return;
		if (e.key === kbd.ARROW_UP) {
			updateSegment('second', (prev) => {
				if (prev === null) {
					return min;
				}
				const next = dateNow.set({ second: prev }).cycle('second', 1).second;
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('second', (prev) => {
				if (prev === null) {
					return max;
				}
				const next = dateNow.set({ second: prev }).cycle('second', -1).second;
				return next;
			});
			return;
		}

		if (isNumberKey(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('second', (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.second.hasLeftFocus) {
					prev = null;
					states.second.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.second.lastKeyZero = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (states.second.lastKeyZero || num > maxStart) {
						moveToNext = true;
						return num;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value, then we will
				 * reset the segment as if the user had pressed the backspace key and then
				 * typed a number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit, and if so, we're moving to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}

					return num;
				}
				moveToNext = true;

				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, ids.field);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			states.second.hasLeftFocus = false;
			updateSegment('second', (prev) => {
				if (prev === null) return null;
				const str = prev.toString();
				if (str.length === 1) return null;
				return parseInt(str.slice(0, -1));
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, ids.field);
		}
	}

	/*
	 * ---------------------------------------------------------------------------------------------
	 *
	 * DAY PERIOD SEGMENT
	 *
	 * ---------------------------------------------------------------------------------------------
	 */

	function dayPeriodSegmentAttrs(props: SegmentAttrProps) {
		const { $segmentValues } = props;
		if (!('dayPeriod' in $segmentValues)) return {};

		const valueMin = 0;
		const valueMax = 12;
		const valueNow = $segmentValues.dayPeriod ?? 0;
		const valueText = $segmentValues.dayPeriod ?? 'AM';

		return {
			...segmentDefaults,
			inputmode: 'text',
			id: ids.secondSegment,
			'aria-label': 'AM/PM',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
			'data-segment': 'dayPeriod',
		};
	}

	function dayPeriodSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', handleDayPeriodSegmentKeydown)
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	/**
	 * The event handler responsible for handling keydown events
	 * on the minute segment.
	 */

	function handleDayPeriodSegmentKeydown(e: KeyboardEvent) {
		if (!isTabKey(e.key)) {
			e.preventDefault();
		}

		if (!isAcceptableSegmentKey(e.key) && e.key !== kbd.A && e.key !== kbd.P) {
			return;
		}

		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) {
			updateSegment('dayPeriod', (prev) => {
				if (prev === 'AM') return 'PM';
				return 'AM';
			});
			return;
		}

		if (e.key === kbd.BACKSPACE) {
			states.second.hasLeftFocus = false;
			updateSegment('dayPeriod', () => 'AM');
		}

		if (e.key === 'a') {
			updateSegment('dayPeriod', () => 'AM');
		}
		if (e.key === 'p') {
			updateSegment('dayPeriod', () => 'PM');
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, ids.field);
		}
	}

	function getOptsByGranularity(granularity: Granularity) {
		const opts: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZoneName: 'short',
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

	/**
	 *
	 */
	function initializeSegmentValues(granularity: Granularity) {
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

	function initializeContentSegments(granularity: Granularity) {
		const parts = formatter.toParts(
			getPlaceholderDate(get(placeholderValue)),
			getOptsByGranularity(granularity)
		);
		const initialParts = parts.map((part) => {
			if (part.type === 'literal' || part.type === 'dayPeriod' || part.type === 'timeZoneName') {
				return [part.type, part.value];
			}
			return [part.type, null];
		});
		return initialParts;
	}

	function getPlaceholderDate(dateObj: DateValue) {
		if (dateObj instanceof ZonedDateTime) {
			return dateObj.toDate();
		} else if (dateObj instanceof CalendarDateTime) {
			return dateObj.toDate(getLocalTimeZone());
		} else {
			return dateObj.toDate(getLocalTimeZone());
		}
	}

	/*
	 * ---------------------------------------------------------------------------------------------
	 *
	 * LITERAL SEGMENT
	 *
	 * ---------------------------------------------------------------------------------------------
	 */

	function literalSegmentAttrs(_: SegmentAttrProps) {
		return {
			'aria-hidden': true,
			'data-type': 'literal',
		};
	}

	function literalSegmentAction() {
		return {
			// noop
		};
	}

	/*
	 * ---------------------------------------------------------------------------------------------
	 *
	 * TIMEZONE SEGMENT
	 *
	 * ---------------------------------------------------------------------------------------------
	 */

	function timeZoneSegmentAttrs(_: SegmentAttrProps) {
		return {
			role: 'textbox',
			'aria-label': 'timezone, ',
			'data-readonly': true,
			'data-segment': 'timeZoneName',
			tabindex: 0,
		};
	}

	function timeZoneSegmentAction() {
		return {
			// nooop
		};
	}

	return {
		elements: {
			segment,
		},
		states: {
			segmentValues,
			segmentContents,
		},
	};
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

export function moveToNextSegment(e: KeyboardEvent, containerId: string) {
	const node = e.currentTarget;
	if (!isHTMLElement(node)) return;
	const { next } = getPrevNextSegments(node, containerId);
	if (!next) return;
	next.focus();
}

function isAcceptableSegmentKey(key: string) {
	if (acceptableSegmentKeys.includes(key)) return true;
	if (isNumberKey(key)) return true;
	return false;
}

function isNumberKey(key: string) {
	if (isNaN(parseInt(key))) return false;
	return true;
}

export function isSegmentNavigationKey(key: string) {
	if (key === kbd.ARROW_RIGHT || key === kbd.ARROW_LEFT) return true;
	return false;
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

function isTabKey(key: string) {
	return key === kbd.TAB;
}

function isSegmentPart(part: string): part is SegmentPart {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return segmentParts.includes(part as any);
}

function isDateSegmentPart(part: unknown): part is DateSegmentPart {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return dateSegmentParts.includes(part as any);
}

function isDateAndTimeSegmentObj(obj: unknown): obj is DateAndTimeSegmentObj {
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
 * Conditionally handles converting the provided date object to
 * a Date object based on the type of `DateValue`.
 */
function toDate(dateObj: DateValue) {
	if (dateObj instanceof ZonedDateTime) {
		return dateObj.toDate();
	} else {
		return dateObj.toDate(getLocalTimeZone());
	}
}

function hasTime(dateObj: DateValue): dateObj is CalendarDateTime | ZonedDateTime {
	return dateObj instanceof CalendarDateTime || dateObj instanceof ZonedDateTime;
}
