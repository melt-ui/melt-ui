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
import { get, writable, type Writable } from 'svelte/store';

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
	'data-segment': '',
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

export function createSegments(props: CreateSegmentProps) {
	const { stores, ids, options } = props;
	const lastKeyZero = {
		day: false,
		month: false,
		year: false,
		hour: false,
		minute: false,
		second: false,
	};

	const hasLeftFocus = {
		day: false,
		month: false,
		year: false,
		hour: false,
		minute: false,
		second: false,
	};

	const { activeDate, value } = stores;
	const { hourCycle } = options;

	type NumOrNull = number | null;

	const dayValue = writable<NumOrNull>(null);
	const monthValue = writable<NumOrNull>(null);
	const yearValue = writable<NumOrNull>(null);
	const hourValue = writable<NumOrNull>(null);
	const minuteValue = writable<NumOrNull>(null);
	const secondValue = writable<NumOrNull>(null);
	const dayPeriodValue = writable<'AM' | 'PM'>('AM');

	const daySegment = builder(name('day-segment'), {
		stores: [activeDate, dayValue],
		returned: ([$activeDate, $dayValue]) => {
			const activeDay = dayjs($activeDate).date();
			const valueMin = 1;
			const valueMax = dayjs($activeDate).daysInMonth();

			return {
				...segmentDefaults,
				id: ids.daySegment,
				'aria-label': 'day, ',
				'aria-valuemin': valueMin,
				'aria-valuemax': valueMax,
				'aria-valuenow': $dayValue ?? activeDay,
				'aria-valuetext': $dayValue ?? 'Empty',
				'data-type': 'day',
			};
		},
		action: (node: HTMLElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', handleDaySegmentKeydown),
				addMeltEventListener(node, 'focusout', () => (hasLeftFocus.day = true))
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const monthSegment = builder(name('month-segment'), {
		stores: [activeDate, monthValue],
		returned: ([$activeDate, $monthValue]) => {
			const valueMin = 1;
			const valueMax = 12;
			const activeDjs = dayjs($activeDate);
			const activeMonth = activeDjs.month();
			const activeMonthString = activeDjs.format('MMMM');

			return {
				...segmentDefaults,
				id: ids.monthSegment,
				'aria-label': 'month, ',
				contenteditable: true,
				'aria-valuemin': valueMin,
				'aria-valuemax': valueMax,
				'aria-valuenow': $monthValue ?? `${activeMonth + 1} - ${activeMonthString}`,
				'aria-valuetext': $monthValue ?? 'Empty',
				'data-type': 'month',
			};
		},
		action: (node: HTMLElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', handleMonthSegmentKeydown),
				addMeltEventListener(node, 'focusout', () => (hasLeftFocus.month = true))
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const yearSegment = builder(name('year-segment'), {
		stores: [yearValue],
		returned: ([$yearValue]) => {
			const valueMin = 1;
			const valueMax = 9999;

			const currentYear = dayjs(new Date()).year();

			return {
				...segmentDefaults,
				id: ids.yearSegment,
				'aria-label': 'year, ',
				'aria-valuemin': valueMin,
				'aria-valuemax': valueMax,
				'aria-valuenow': $yearValue ?? `${currentYear}`,
				'aria-valuetext': $yearValue ?? 'Empty',
				'data-type': 'year',
			};
		},
		action: (node: HTMLElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', handleYearSegmentKeydown),
				addMeltEventListener(node, 'focusout', () => (hasLeftFocus.year = true))
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const hourSegment = builder(name('hour-segment'), {
		stores: [hourValue, hourCycle],
		returned: ([$hourValue, $hourCycle]) => {
			const valueMin = $hourCycle === 12 ? 1 : 0;
			const valueMax = $hourCycle === 12 ? 12 : 23;

			return {
				...segmentDefaults,
				id: ids.hourSegment,
				'aria-label': 'hour, ',
				'aria-valuemin': valueMin,
				'aria-valuemax': valueMax,
				'aria-valuenow': $hourValue ?? `${valueMin}`,
				'aria-valuetext': $hourValue ?? 'Empty',
				'data-type': 'hour',
			};
		},
		action: (node: HTMLElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', handleHourSegmentKeydown),
				addMeltEventListener(node, 'focusout', () => (hasLeftFocus.hour = true))
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const minuteSegment = builder(name('minute-segment'), {
		stores: [minuteValue],
		returned: ([$minuteValue]) => {
			const valueMin = 0;
			const valueMax = 59;

			return {
				...segmentDefaults,
				id: ids.minuteSegment,
				'aria-label': 'minute, ',
				'aria-valuemin': valueMin,
				'aria-valuemax': valueMax,
				'aria-valuenow': $minuteValue ?? `${valueMin}`,
				'aria-valuetext': $minuteValue ?? 'Empty',
				'data-type': 'minute',
			};
		},
		action: (node: HTMLElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', handleMinuteSegmentKeydown),
				addMeltEventListener(node, 'focusout', () => (hasLeftFocus.minute = true))
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const secondSegment = builder(name('minute-segment'), {
		stores: [secondValue],
		returned: ([$secondValue]) => {
			const valueMin = 0;
			const valueMax = 59;

			return {
				...segmentDefaults,
				id: ids.secondSegment,
				'aria-label': 'second, ',
				'aria-valuemin': valueMin,
				'aria-valuemax': valueMax,
				'aria-valuenow': $secondValue ?? `${valueMin}`,
				'aria-valuetext': $secondValue ?? 'Empty',
				'data-type': 'second',
			};
		},
		action: (node: HTMLElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', handleSecondSegmentKeydown),
				addMeltEventListener(node, 'focusout', () => (hasLeftFocus.second = true))
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

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
				'data-type': 'second',
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
	 * on the day segment.
	 */
	function handleDaySegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}
		e.preventDefault();

		const $activeDate = get(activeDate);
		const activeDjs = dayjs($activeDate);
		const daysInMonth = activeDjs.daysInMonth();

		if (e.key === kbd.ARROW_UP) {
			dayValue.update((prev) => {
				if (prev === null || prev === daysInMonth) return 1;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			dayValue.update((prev) => {
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
			dayValue.update((prev) => {
				const max = daysInMonth;
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (hasLeftFocus.day) {
					prev = null;
					hasLeftFocus.day = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						lastKeyZero.day = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (lastKeyZero.day || num > maxStart) {
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

			dayValue.update((prev) => {
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

	/**
	 * The event handler responsible for handling keydown events
	 * on the month segment.
	 */
	function handleMonthSegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}
		e.preventDefault();

		const min = 1;
		const max = 12;

		if (e.key === kbd.ARROW_UP) {
			monthValue.update((prev) => {
				if (prev === null || prev === max) return 1;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			monthValue.update((prev) => {
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
			monthValue.update((prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (hasLeftFocus.month) {
					prev = null;
					hasLeftFocus.month = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						lastKeyZero.month = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (1), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (lastKeyZero.month || num > maxStart) {
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
			hasLeftFocus.month = false;
			monthValue.update((prev) => {
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

	/**
	 * The event handler responsible for handling keydown events
	 * on the day segment.
	 */
	function handleYearSegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		e.preventDefault();

		const min = 0;
		const currentYear = dayjs(new Date()).year();

		if (e.key === kbd.ARROW_UP) {
			yearValue.update((prev) => {
				if (prev === null) return currentYear;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			yearValue.update((prev) => {
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
			yearValue.update((prev) => {
				if (hasLeftFocus.year) {
					prev = null;
					hasLeftFocus.year = false;
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
			yearValue.update((prev) => {
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

	/**
	 * The event handler responsible for handling keydown events
	 * on the hour segment.
	 */
	function handleHourSegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}
		e.preventDefault();

		const min = get(hourCycle) === 12 ? 1 : 0;
		const max = get(hourCycle) === 12 ? 12 : 23;

		if (e.key === kbd.ARROW_UP) {
			hourValue.update((prev) => {
				if (prev === null || prev === max) return min;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			hourValue.update((prev) => {
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
			hourValue.update((prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (hasLeftFocus.hour) {
					prev = null;
					hasLeftFocus.hour = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						lastKeyZero.hour = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (lastKeyZero.hour || num > maxStart) {
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
			hasLeftFocus.hour = false;
			hourValue.update((prev) => {
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

	/**
	 * The event handler responsible for handling keydown events
	 * on the minute segment.
	 */
	function handleMinuteSegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}
		e.preventDefault();

		const min = 0;
		const max = 59;

		if (e.key === kbd.ARROW_UP) {
			minuteValue.update((prev) => {
				if (prev === null || prev === max) return min;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			minuteValue.update((prev) => {
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
			minuteValue.update((prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (hasLeftFocus.minute) {
					prev = null;
					hasLeftFocus.minute = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						lastKeyZero.minute = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (lastKeyZero.minute || num > maxStart) {
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
			hasLeftFocus.minute = false;
			minuteValue.update((prev) => {
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

	/**
	 * The event handler responsible for handling keydown events
	 * on the minute segment.
	 */
	function handleSecondSegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}
		e.preventDefault();

		const min = 0;
		const max = 59;

		if (e.key === kbd.ARROW_UP) {
			secondValue.update((prev) => {
				if (prev === null || prev === max) return min;
				return prev + 1;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			secondValue.update((prev) => {
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
			secondValue.update((prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (hasLeftFocus.second) {
					prev = null;
					hasLeftFocus.second = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						lastKeyZero.second = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (lastKeyZero.second || num > maxStart) {
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
			hasLeftFocus.second = false;
			secondValue.update((prev) => {
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

		if (!acceptableKeys.includes(e.key)) {
			return;
		}
		e.preventDefault();

		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) {
			dayPeriodValue.update((prev) => {
				if (prev === 'AM') return 'PM';
				return 'AM';
			});
			return;
		}

		if (e.key === kbd.BACKSPACE) {
			hasLeftFocus.second = false;
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

	effect([value], ([$value]) => {
		if ($value === null) return;
		const djs = dayjs($value);

		if (get(dayValue) !== djs.date()) {
			dayValue.set(djs.date());
		}
		if (get(monthValue) !== djs.month() + 1) {
			monthValue.set(djs.month() + 1);
		}
		if (get(yearValue) !== djs.year()) {
			yearValue.set(djs.year());
		}
		if (get(hourValue) !== djs.hour()) {
			hourValue.set(djs.hour());
		}
		if (get(minuteValue) !== djs.minute()) {
			minuteValue.set(djs.minute());
		}
		if (get(secondValue) !== djs.second()) {
			secondValue.set(djs.second());
		}
	});

	effect([dayValue], ([$dayValue]) => {
		const djs = dayjs(get(value));

		if ($dayValue !== djs.date()) {
			value.set(djs.date($dayValue ? $dayValue : 1).toDate());
		}
	});

	effect([monthValue], ([$monthValue]) => {
		const djs = dayjs(get(value));
		if ($monthValue !== djs.month() + 1) {
			value.set(djs.month($monthValue ? $monthValue - 1 : 0).toDate());
		}
	});

	effect([yearValue], ([$yearValue]) => {
		const djs = dayjs(get(value));
		if ($yearValue !== djs.year()) {
			value.set(djs.year($yearValue ? $yearValue : 0).toDate());
		}
	});

	effect([hourValue], ([$hourValue]) => {
		const djs = dayjs(get(value));
		if ($hourValue !== djs.hour()) {
			value.set(djs.hour($hourValue ? $hourValue : 0).toDate());
		}
	});

	effect([minuteValue], ([$minuteValue]) => {
		const djs = dayjs(get(value));
		if ($minuteValue !== djs.minute()) {
			value.set(djs.minute($minuteValue ? $minuteValue : 0).toDate());
		}
	});

	effect([secondValue], ([$secondValue]) => {
		const djs = dayjs(get(value));
		if ($secondValue !== djs.second()) {
			value.set(djs.second($secondValue ? $secondValue : 0).toDate());
		}
	});

	return {
		elements: {
			daySegment,
			monthSegment,
			yearSegment,
			hourSegment,
			minuteSegment,
			secondSegment,
			dayPeriodSegment,
		},
		states: {
			dayValue,
			monthValue,
			yearValue,
			hourValue,
			minuteValue,
			secondValue,
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
