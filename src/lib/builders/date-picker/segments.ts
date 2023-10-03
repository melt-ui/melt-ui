import {
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	isHTMLElement,
	kbd,
	styleToString,
} from '$lib/internal/helpers/index.js';
import dayjs from 'dayjs';
import type { _DatePickerParts, _DatePickerIds, _DatePickerStores } from './create.js';
import { get, writable, type Updater, type Writable } from 'svelte/store';
import type { Action } from 'svelte/action';

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
};

const segmentParts = ['date', 'month', 'year', 'hour', 'minute', 'second'] as const;

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

export function createSegments(props: CreateSegmentProps) {
	const { stores, ids, options } = props;

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

	const { focusedValue, value } = stores;
	const { hourCycle } = options;

	const initialSegments = Object.fromEntries(
		segmentParts.map((part) => [part, null])
	) as SegmentValueObj;

	const segmentValues = writable(structuredClone(initialSegments));
	const dayPeriodValue = writable<'AM' | 'PM'>('AM');

	/**
	 * Syncs the segment values with the `value` store.
	 */
	function syncSegmentValues(value: Date) {
		const djs = dayjs(value);
		segmentValues.set(
			Object.fromEntries(
				segmentParts.map((part) => [part, part === 'month' ? djs.get(part) + 1 : djs.get(part)])
			) as SegmentValueObj
		);
	}

	/**
	 * Get the segments being used/ are rendered in the DOM.
	 */
	function getUsedSegments() {
		const segmentRoot = document.getElementById(ids.input);
		if (!segmentRoot) return [];
		const segmentEls = Array.from(segmentRoot.querySelectorAll('[data-segment]'))
			.filter((el): el is HTMLElement => isHTMLElement(el))
			.map((el) => {
				return el.dataset.segment;
			});
		return segmentEls.filter((part): part is SegmentPart => {
			return segmentParts.includes(part as SegmentPart);
		});
	}

	function getPartFromNode(node: HTMLElement) {
		const part = node.dataset.segment;
		if (!part) return null;
		return part as SegmentPart;
	}

	function setValueFromSegments(segmentObj: SegmentValueObj) {
		const usedSegments = getUsedSegments();
		let djs = dayjs();
		usedSegments.forEach((part) => {
			const value = segmentObj[part];
			if (value === null) return;
			djs = djs.set(part, part === 'month' ? value - 1 : value);
		});

		return value.set(djs.toDate());
	}

	/**
	 *
	 */
	function areAllSegmentsFilled() {
		const usedSegments = getUsedSegments();
		const $segmentValues = get(segmentValues);
		return usedSegments.every((part) => $segmentValues[part] !== null);
	}

	function updateSegment(part: SegmentPart, cb: Updater<number | null>) {
		segmentValues.update((prev) => {
			const prevSegment = prev[part];
			return {
				...prev,
				[part]: prevSegment === null ? 0 : cb(prevSegment),
			};
		});
		const $segmentValues = get(segmentValues);
		if (areAllSegmentsFilled()) {
			setValueFromSegments($segmentValues);
		}
	}

	const segmentBuilders: SegmentBuilders = {
		date: {
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

	effect(value, ($value) => {
		if ($value) {
			syncSegmentValues($value);
		} else {
			segmentValues.set(structuredClone(initialSegments));
		}
	});

	const segment = builder(name('segment'), {
		stores: [focusedValue, segmentValues, hourCycle],
		returned: ([$focusedValue, $segmentValues, $hourCycle]) => {
			const props = {
				$focusedValue,
				$segmentValues,
				$hourCycle,
			};
			return (part: SegmentPart) => getSegmentAttrs(part, props);
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
		$focusedValue: Date;
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
		const { $segmentValues, $focusedValue } = props;
		const dayValue = $segmentValues.date;
		const activeDay = dayjs($focusedValue).date();
		const valueMin = 1;
		const valueMax = dayjs($focusedValue).daysInMonth();

		return {
			...segmentDefaults,
			id: ids.daySegment,
			'aria-label': 'day, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': dayValue ?? activeDay,
			'aria-valuetext': dayValue ?? 'Empty',
			'data-segment': 'date',
		};
	}

	function daySegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', handleDaySegmentKeydown),
			addMeltEventListener(node, 'focusout', () => (states.date.hasLeftFocus = true))
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleDaySegmentKeydown(e: KeyboardEvent) {
		if (e.key !== kbd.TAB) {
			e.preventDefault();
		}
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		const $focusedValue = get(focusedValue);
		const activeDjs = dayjs($focusedValue);
		const daysInMonth = activeDjs.daysInMonth();

		if (e.key === kbd.ARROW_UP) {
			updateSegment('date', (prev) => {
				if (prev === null || prev === daysInMonth) return 1;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('date', (prev) => {
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
			updateSegment('date', (prev) => {
				const max = daysInMonth;
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.date.hasLeftFocus) {
					prev = null;
					states.date.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.date.lastKeyZero = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (states.date.lastKeyZero || num > maxStart) {
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
				moveToNextSegment(e, ids.input);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			const currentTarget = e.currentTarget;
			if (!isHTMLElement(currentTarget)) return;

			updateSegment('date', (prev) => {
				if (prev === null) return null;
				const str = prev.toString();
				if (str.length === 1) return null;
				return parseInt(str.slice(0, -1));
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, ids.input);
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
		const { $segmentValues, $focusedValue } = props;
		const monthValue = $segmentValues.month;
		const valueMin = 1;
		const valueMax = 12;
		const activeDjs = dayjs($focusedValue);
		const activeMonth = activeDjs.month();
		const activeMonthString = activeDjs.format('MMMM');

		return {
			...segmentDefaults,
			id: ids.monthSegment,
			'aria-label': 'month, ',
			contenteditable: true,
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': monthValue ?? `${activeMonth + 1} - ${activeMonthString}`,
			'aria-valuetext': monthValue ?? 'Empty',
			'data-segment': 'month',
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
		if (e.key !== kbd.TAB) {
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
				moveToNextSegment(e, ids.input);
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
			handleSegmentNavigation(e, ids.input);
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
		const yearValue = $segmentValues.year;
		const valueMin = 1;
		const valueMax = 9999;

		const currentYear = dayjs(new Date()).year();

		return {
			...segmentDefaults,
			id: ids.yearSegment,
			'aria-label': 'year, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': yearValue ?? `${currentYear}`,
			'aria-valuetext': yearValue ?? 'Empty',
			'data-segment': 'year',
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
		if (e.key !== kbd.TAB) {
			e.preventDefault();
		}
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		states.year.hasTouched = true;

		const min = 0;
		const currentYear = dayjs(new Date()).year();

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
				moveToNextSegment(e, ids.input);
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
			handleSegmentNavigation(e, ids.input);
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
		const hourValue = $segmentValues.hour;
		const valueMin = $hourCycle === 12 ? 1 : 0;
		const valueMax = $hourCycle === 12 ? 12 : 23;

		return {
			...segmentDefaults,
			id: ids.hourSegment,
			'aria-label': 'hour, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': hourValue ?? `${valueMin}`,
			'aria-valuetext': hourValue ?? 'Empty',
			'data-segment': 'hour',
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
		if (e.key !== kbd.TAB) {
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
				moveToNextSegment(e, ids.input);
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
			handleSegmentNavigation(e, ids.input);
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
		const minuteValue = $segmentValues.minute;
		const valueMin = 0;
		const valueMax = 59;

		return {
			...segmentDefaults,
			id: ids.minuteSegment,
			'aria-label': 'minute, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': minuteValue ?? `${valueMin}`,
			'aria-valuetext': minuteValue ?? 'Empty',
			'data-segment': 'minute',
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
		if (e.key !== kbd.TAB) {
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
				moveToNextSegment(e, ids.input);
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
			handleSegmentNavigation(e, ids.input);
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
		const secondValue = $segmentValues.second;
		const valueMin = 0;
		const valueMax = 59;

		return {
			...segmentDefaults,
			id: ids.secondSegment,
			'aria-label': 'second, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': secondValue ?? `${valueMin}`,
			'aria-valuetext': secondValue ?? 'Empty',
			'data-segment': 'second',
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
		if (e.key !== kbd.TAB) {
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
				moveToNextSegment(e, ids.input);
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
			handleSegmentNavigation(e, ids.input);
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
				'data-segment': 'period',
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
		const acceptableKeys = [
			kbd.ARROW_UP,
			kbd.ARROW_DOWN,
			kbd.ARROW_LEFT,
			kbd.ARROW_RIGHT,
			kbd.BACKSPACE,
			'a',
			'p',
		];

		if (e.key !== kbd.TAB) {
			e.preventDefault();
		}

		if (!acceptableKeys.includes(e.key)) {
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
			handleSegmentNavigation(e, ids.input);
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
		},
	};
}

const acceptableKeys = [
	kbd.ENTER,
	kbd.ARROW_UP,
	kbd.ARROW_DOWN,
	kbd.ARROW_LEFT,
	kbd.ARROW_RIGHT,
	kbd.BACKSPACE,
];

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
	if (acceptableKeys.includes(key)) return true;
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
	if (!segments || !segments.length) {
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
	if (!isHTMLElement(inputContainer)) return null;
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
