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
import { getLocalTimeZone, type DateValue, now } from '@internationalized/date';
import { getDaysInMonth } from './utils.js';

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

const segmentParts = ['day', 'month', 'year', 'hour', 'minute', 'second'] as const;

type SegmentPart = (typeof segmentParts)[number];

type SegmentState = {
	lastKeyZero: boolean;
	hasLeftFocus: boolean;
	hasInitialized: boolean;
	hasTouched: boolean;
};

type SegmentValueObj = Record<SegmentPart, number | null>;

type SegmentStates = {
	[K in SegmentPart]: SegmentState;
};

type DayPeriod = 'AM' | 'PM';

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

	const { value } = stores;
	const { hourCycle } = options;

	const dateNow = now(getLocalTimeZone());

	const initialSegments = Object.fromEntries(
		segmentParts.map((part) => [part, null])
	) as SegmentValueObj;

	const segmentValues = writable(structuredClone(initialSegments));
	const dayPeriodValue = writable<DayPeriod>('AM');
	const isUsingDayPeriod = writable(false);

	const segmentContents = derived(segmentValues, ($segmentValues) => {
		const contents = Object.keys($segmentValues).reduce((obj, part) => {
			if (!isSegmentPart(part)) return obj;
			const value = $segmentValues[part];

			const notNull = value !== null;

			switch (part) {
				case 'day':
					obj[part] = notNull
						? formatter.custom(dateNow.set({ day: value }).toDate(), {
								day: '2-digit',
						  })
						: 'DD';
					break;
				case 'month':
					obj[part] = notNull
						? formatter.custom(dateNow.set({ month: value - 1 }).toDate(), {
								month: '2-digit',
						  })
						: 'MM';
					break;
				case 'year':
					obj[part] = notNull
						? formatter.custom(dateNow.set({ year: value }).toDate(), {
								year: 'numeric',
						  })
						: 'YYYY';
					break;
				case 'hour':
					obj[part] = notNull
						? formatter.custom(dateNow.set({ hour: value }).toDate(), {
								hour: '2-digit',
						  })
						: 'hh';
					break;
				case 'minute':
					obj[part] = notNull
						? formatter.custom(dateNow.set({ minute: value }).toDate(), {
								minute: '2-digit',
						  })
						: 'mm';
					break;
				case 'second':
					obj[part] = notNull
						? formatter.custom(dateNow.set({ second: value }).toDate(), {
								second: '2-digit',
						  })
						: 'ss';
					break;
			}
			return obj;
		}, {} as SegmentContent);

		return contents;
	});

	/**
	 * Sets the individual segment values based on the current
	 * value of the date picker.
	 */
	function syncSegmentValues(value: DateValue) {
		segmentValues.set(
			Object.fromEntries(
				segmentParts.map((part) => {
					switch (part) {
						case 'day':
							return [part, value.day];
						case 'month':
							return [part, value.month + 1];
						case 'year':
							return [part, value.year];
						case 'hour':
							return [part, getHourForSegmentValue(value && 'hour' in value ? value.hour : 0)];
						case 'minute':
							return [part, value && 'minute' in value ? value.minute : 0];
						case 'second':
							return [part, value && 'second' in value ? value.second : 0];
					}
				})
			) as SegmentValueObj
		);
	}

	/**
	 * Get the segments being used/ are rendered in the DOM.
	 * We're using this to determine when to set the value of
	 * the date picker, which is when all the segments have
	 * been filled.
	 */
	function getUsedSegments() {
		let dayPeriodExists = false;
		if (!isBrowser) return [];
		const usedSegments = getSegments(ids.field)
			.map((el) => {
				if (el.dataset.segment === 'dayPeriod') {
					dayPeriodExists = true;
				}
				return el.dataset.segment;
			})
			.filter((part): part is SegmentPart => {
				return segmentParts.includes(part as SegmentPart);
			});
		if (dayPeriodExists) {
			isUsingDayPeriod.set(true);
		}
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
			const value = segmentObj[part];
			if (value === null) return;
			switch (part) {
				case 'month':
					date = date.set({ month: value - 1 });
					break;
				case 'hour':
					date = date.set({ hour: getHourForValue(value) });
					break;
				default:
					date = date.set({
						[part]: value,
					});
			}
		});

		return value.set(date);
	}

	function getHourForSegmentValue(hour: number) {
		const $hourCycle = get(hourCycle);
		if ($hourCycle === 24) return hour;

		// convert hour from 24 to 12 hour cycle and set day period
		if (hour > 12) {
			dayPeriodValue.set('PM');
			return hour - 12;
		}
		if (hour === 0) {
			dayPeriodValue.set('AM');
			return 12;
		}
		dayPeriodValue.set('AM');
		return hour;
	}

	function getHourForValue(hour: number) {
		const $hourCycle = get(hourCycle);
		const $dayPeriodValue = get(dayPeriodValue);
		if ($hourCycle === 24) return hour;

		// convert hour from 12 to 24 hour cycle based on day period
		if ($dayPeriodValue === 'AM' && hour === 12) {
			return 0;
		}
		if ($dayPeriodValue === 'PM' && hour !== 12) {
			return hour + 12;
		}

		return hour;
	}

	function areAllSegmentsFilled() {
		const usedSegments = getUsedSegments();
		const $segmentValues = get(segmentValues);
		return usedSegments.every((part) => $segmentValues[part] !== null);
	}

	function updateSegment(part: SegmentPart, cb: Updater<number | null>) {
		segmentValues.update((prev) => {
			const prevSegment = prev[part];
			const next = cb(prevSegment);
			if (part === 'month' && next !== null && prev.day !== null) {
				const date = dateNow.set({ month: next - 1 });
				const daysInMonth = getDaysInMonth(date.toDate());
				if (prev.day > daysInMonth) {
					prev.day = daysInMonth;
				}
			}

			return {
				...prev,
				[part]: next,
			};
		});
		const $segmentValues = get(segmentValues);
		if (areAllSegmentsFilled()) {
			setValueFromSegments($segmentValues);
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
	};

	effect([value], ([$value]) => {
		if ($value) {
			syncSegmentValues($value);
		} else {
			segmentValues.set(structuredClone(initialSegments));
		}
	});

	effect([dayPeriodValue], ([$dayPeriodValue]) => {
		updateSegment('hour', (prev) => {
			if (!prev) return prev;
			const hour = prev;

			const $hourCycle = get(hourCycle);
			if ($hourCycle === 24) return prev;

			if ($dayPeriodValue === 'AM' && hour >= 12) {
				prev = hour - 12;
			}
			return prev;
		});
	});

	const segment = builder(name('segment'), {
		stores: [segmentValues, hourCycle],
		returned: ([$segmentValues, $hourCycle]) => {
			const props = {
				$segmentValues,
				$hourCycle,
			};
			return (part: SegmentPart) => ({ ...getSegmentAttrs(part, props), 'data-segment': part });
		},
		action: (node: HTMLElement) => getSegmentAction(node),
	});

	type SegmentAttrFn = (props: SegmentAttrProps) => Record<string, string | number | boolean>;

	type SegmentBuilders = Record<
		SegmentPart,
		{
			attrs: SegmentAttrFn;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			action: Action<any, any, any>;
		}
	>;

	type SegmentAttrProps = {
		$segmentValues: SegmentValueObj;
		$hourCycle: 12 | 24 | undefined;
	};

	function getSegmentAttrs(part: SegmentPart, props: SegmentAttrProps) {
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
		const { $segmentValues } = props;
		const isEmpty = $segmentValues.day === null;
		const $focusedValue = get(stores.focusedValue);
		const date = $segmentValues.day
			? $focusedValue.set({ day: $segmentValues.day })
			: $focusedValue;

		const valueNow = date.day;
		const valueMin = 1;
		const valueMax = getDaysInMonth(date.toDate(getLocalTimeZone()));
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
			? getDaysInMonth(dateNow.set({ month: $segmentMonthValue }).toDate())
			: getDaysInMonth(dateNow.toDate());

		if (e.key === kbd.ARROW_UP) {
			updateSegment('day', (prev) => {
				if (prev === null || prev === daysInMonth) return 1;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('day', (prev) => {
				if (prev === null || prev === 1) {
					return daysInMonth;
				}
				return prev - 1;
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
		const { $segmentValues } = props;
		const isEmpty = $segmentValues.month === null;
		const date = $segmentValues.month ? dateNow.set({ month: $segmentValues.month - 1 }) : dateNow;
		const valueNow = date.month + 1;
		const valueMin = 1;
		const valueMax = 12;
		const valueText = isEmpty ? 'Empty' : `${valueNow} - ${formatter.fullMonth(date.toDate())}`;

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

		states.month.hasTouched = true;

		const min = 1;
		const max = 12;

		if (e.key === kbd.ARROW_UP) {
			updateSegment('month', (prev) => {
				if (prev === null || prev === max) return 1;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('month', (prev) => {
				if (prev === null || prev === min) {
					return max;
				}
				return prev - 1;
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
		const { $segmentValues, $hourCycle } = props;
		const isEmpty = $segmentValues.hour === null;
		const date = $segmentValues.hour ? dateNow.set({ hour: $segmentValues.hour }) : dateNow;
		const valueNow = date.hour;
		const valueMin = $hourCycle === 12 ? 1 : 0;
		const valueMax = $hourCycle === 12 ? 12 : 23;
		const valueText = isEmpty ? 'Empty' : `${valueNow} ${get(dayPeriodValue)}`;

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

		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		states.hour.hasTouched = true;

		const min = get(hourCycle) === 12 ? 1 : 0;
		const max = get(hourCycle) === 12 ? 12 : 23;

		if (e.key === kbd.ARROW_UP) {
			updateSegment('hour', (prev) => {
				if (prev === null || prev === max) return min;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('hour', (prev) => {
				if (prev === null || prev === min) {
					return max;
				}
				return prev - 1;
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
		const { $segmentValues } = props;
		const isEmpty = $segmentValues.minute === null;
		const date = $segmentValues.minute ? dateNow.set({ minute: $segmentValues.minute }) : dateNow;
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
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		states.minute.hasTouched = true;

		const min = 0;
		const max = 59;

		if (e.key === kbd.ARROW_UP) {
			updateSegment('minute', (prev) => {
				if (prev === null || prev === max) return min;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('minute', (prev) => {
				if (prev === null || prev === min) {
					return max;
				}
				return prev - 1;
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
		const { $segmentValues } = props;
		const isEmpty = $segmentValues.second === null;
		const date = $segmentValues.second ? dateNow.set({ second: $segmentValues.second }) : dateNow;
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

		if (e.key === kbd.ARROW_UP) {
			updateSegment('second', (prev) => {
				if (prev === null || prev === max) return min;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('second', (prev) => {
				if (prev === null || prev === min) {
					return max;
				}
				return prev - 1;
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

	const dayPeriodSegment = builder(name('dayPeriod-segment'), {
		stores: [dayPeriodValue],
		returned: ([$dayPeriodValue]) => {
			const valueMin = 0;
			const valueMax = 12;

			return {
				...segmentDefaults,
				inputmode: 'text',
				id: ids.secondSegment,
				'aria-label': 'AM/PM',
				'aria-valuemin': valueMin,
				'aria-valuemax': valueMax,
				'aria-valuenow': $dayPeriodValue ?? `${valueMin}`,
				'aria-valuetext': $dayPeriodValue ?? 'AM',
				'data-segment': 'dayPeriod',
			};
		},
		action: (node: HTMLElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', handleDayPeriodSegmentKeydown)
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

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
			dayPeriodValue.update((prev) => {
				if (prev === 'AM') return 'PM';
				return 'AM';
			});
			return;
		}

		if (e.key === kbd.BACKSPACE) {
			states.second.hasLeftFocus = false;
			dayPeriodValue.update(() => 'AM');
		}

		if (e.key === 'a') {
			dayPeriodValue.update(() => 'AM');
		}
		if (e.key === 'p') {
			dayPeriodValue.update(() => 'PM');
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, ids.field);
		}
	}

	return {
		elements: {
			segment,
			dayPeriodSegment,
		},
		states: {
			segmentValues,
			dayPeriodValue,
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
	const segments = Array.from(inputContainer.querySelectorAll('[data-segment]')).filter(
		(el): el is HTMLElement => isHTMLElement(el)
	);
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
	return segmentParts.includes(part as SegmentPart);
}
