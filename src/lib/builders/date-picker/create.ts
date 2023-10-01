import {
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	isHTMLElement,
	kbd,
	overridable,
	toWritableStores,
	omit,
	type ChangeFn,
	executeCallbacks,
} from '$lib/internal/helpers/index.js';

import {
	isSameDay,
	getDaysBetween,
	isSelected,
	isMatch,
	getLastFirstDayOfWeek,
	getNextLastDayOfWeek,
	isSingleDate,
	isInSameMonth,
	isToday,
} from '$lib/builders/calendar/utils.js';

import { derived, get, writable } from 'svelte/store';
import type { DateProps, Month } from '$lib/builders/index.js';
import type { CreateDatePickerProps } from './types.js';
import dayjs from 'dayjs';
import { dayJsStore } from './date-store.js';

const defaults = {
	disabled: false,
	earliest: undefined,
	latest: undefined,
	value: undefined,
	activeDate: new Date(),
	allowDeselect: false,
	numberOfMonths: 1,
	pagedNavigation: false,
	weekStartsOn: 0,
	hidden: false,
	defaultValue: undefined,
	onValueChange: undefined,
	fixedWeeks: false,
	hourCycle: 24,
} satisfies CreateDatePickerProps;

type DatePickerParts =
	| 'content'
	| 'nextMonth'
	| 'prevMonth'
	| 'nextYear'
	| 'prevYear'
	| 'dateGrid'
	| 'date'
	| 'next'
	| 'prev'
	| 'date-input'
	| 'month-segment'
	| 'day-segment'
	| 'year-segment'
	| 'hour-segment'
	| 'minute-segment'
	| 'second-segment'
	| 'dayPeriod-segment'
	| 'trigger';

const { name } = createElHelpers<DatePickerParts>('calendar');

export function createDatePicker(props?: CreateDatePickerProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores({
		...omit(withDefaults, 'value'),
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable<Date | undefined>(
		valueWritable,
		withDefaults?.onValueChange as ChangeFn<Date | undefined>
	);
	const activeDate = dayJsStore(options.activeDate);

	const dayValue = writable<number | null>(null);
	const monthValue = writable<number | null>(null);
	const yearValue = writable<number | null>(null);
	const hourValue = writable<number | null>(null);
	const minuteValue = writable<number | null>(null);
	const secondValue = writable<number | null>(null);
	const dayPeriodValue = writable<'AM' | 'PM'>('AM');

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

	const segmentDefaults = {
		role: 'spinbutton',
		contenteditable: true,
		tabindex: 0,
		spellcheck: false,
		inputmode: 'numeric',
		autocorrect: 'off',
		enterkeyhint: 'next',
		'data-segment': '',
	};

	const {
		allowDeselect,
		disabled,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
		hidden,
		hourCycle,
	} = options;

	const months = writable<Month[]>([]);

	const ids = {
		content: generateId(),
		input: generateId(),
		daySegment: generateId(),
		monthSegment: generateId(),
		yearSegment: generateId(),
		hourSegment: generateId(),
		minuteSegment: generateId(),
		secondSegment: generateId(),
		timeIndicatorSegment: generateId(),
		trigger: generateId(),
	};

	/**
	 * Navigate to the next page of the calendar.
	 * If using paged navigation, this will move the calendar forward
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar forward
	 * by one month.
	 */
	function nextMonth() {
		if (get(pagedNavigation)) {
			const $numberOfMonths = get(numberOfMonths);
			activeDate.add($numberOfMonths, 'month');
		} else {
			activeDate.add(1, 'month');
		}
	}

	/**
	 * Navigate to the previous page of the calendar.
	 * If using paged navigation, this will move the calendar backwards
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar backwards
	 * by one month.
	 */
	function prevMonth() {
		if (get(pagedNavigation)) {
			const $numberOfMonths = get(numberOfMonths);
			activeDate.subtract($numberOfMonths, 'month');
		} else {
			activeDate.subtract(1, 'month');
		}
	}

	/**
	 * Navigate to the previous year of the calendar.
	 */
	function nextYear() {
		activeDate.add(1, 'year');
	}

	/**
	 * Navigate to the next year of the calendar.
	 */
	function prevYear() {
		activeDate.subtract(1, 'year');
	}

	const content = builder(name('content'), {
		returned: () => ({ tabindex: -1, id: ids.content }),
		action: (node: HTMLElement) => {
			const unsubKb = addMeltEventListener(node, 'keydown', (e) => {
				const triggerElement = e.currentTarget;
				if (!isHTMLElement(triggerElement)) return;

				if ([kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT].includes(e.key)) {
					e.preventDefault();
					if (e.key === kbd.ARROW_RIGHT) {
						focusElement(1);
					} else if (e.key === kbd.ARROW_LEFT) {
						focusElement(-1);
					} else if (e.key === kbd.ARROW_UP) {
						focusElement(-7);
					} else if (e.key === kbd.ARROW_DOWN) {
						focusElement(7);
					}
				}
			});

			return {
				destroy() {
					unsubKb();
				},
			};
		},
	});

	function handleSingleClick(date: Date) {
		value.update((prev) => {
			if (isSingleDate(prev) || prev === undefined) {
				if (!isInSameMonth(date, get(activeDate))) {
					activeDate.set(date);
				}

				if (prev === undefined) return date;
				if (get(allowDeselect) && isSameDay(prev, date)) {
					return undefined;
				}
			}
			return date;
		});
	}

	const dateInput = builder(name('date-input'), {
		returned: () => {
			return {
				role: 'group',
				id: ids.input,
			};
		},
	});

	const trigger = builder(name('trigger'), {
		returned: () => {
			return {
				id: ids.trigger,
				tabindex: 0,
				'data-segment': '',
			};
		},
		action: (node: HTMLElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', handleTriggerKeydown)
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

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
			node.style.caretColor = 'transparent';
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
			node.style.caretColor = 'transparent';
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
			node.style.caretColor = 'transparent';
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
			node.style.caretColor = 'transparent';
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
			node.style.caretColor = 'transparent';
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
			node.style.caretColor = 'transparent';
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
			node.style.caretColor = 'transparent';
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

	const date = builder(name('date'), {
		stores: [value, disabled, hidden, activeDate],
		returned: ([$value, $disabled, $hidden, $activeDate]) => {
			return (props: DateProps) => {
				const isDisabled = isMatch(props.value, $disabled);
				const isHidden = isMatch(props.value, $hidden);
				const isDateToday = isToday(props.value);
				const isInCurrentMonth = isInSameMonth(props.value, $activeDate);

				const selected = isSelected({
					date: props.value,
					value: $value,
				});

				return {
					role: 'date',
					'aria-selected': selected ? true : undefined,
					'data-selected': selected ? true : undefined,
					'data-value': props.value,
					'data-label': props.label ?? undefined,
					'data-disabled': isDisabled ? '' : undefined,
					'data-hidden': isHidden ? '' : undefined,
					'data-date': '',
					'data-today': isDateToday ? '' : undefined,
					'data-outside-month': isInCurrentMonth ? undefined : '',
					tabindex: isDisabled ? -1 : 1,
				} as const;
			};
		},
		action: (node: HTMLElement) => {
			const getElArgs = () => {
				const value = node.getAttribute('data-value');
				const label = node.getAttribute('data-label');
				const disabled = node.hasAttribute('data-disabled');

				return {
					value,
					label: label ?? node.textContent ?? null,
					disabled: disabled ? true : false,
				};
			};
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					const args = getElArgs();
					if (args.disabled) return;
					const date = new Date(args.value || '');
					handleSingleClick(date);
				})
			);

			return {
				destroy: unsub,
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
				moveToNextSegment(e);
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
			handleSegmentNavigation(e);
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
				moveToNextSegment(e);
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
			handleSegmentNavigation(e);
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
				moveToNextSegment(e);
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
			handleSegmentNavigation(e);
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
				moveToNextSegment(e);
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
			handleSegmentNavigation(e);
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
				moveToNextSegment(e);
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
			handleSegmentNavigation(e);
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
				moveToNextSegment(e);
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
			handleSegmentNavigation(e);
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
			handleSegmentNavigation(e);
		}
	}

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			e.preventDefault();
			handleSegmentNavigation(e);
		}
	}

	function focusElement(add: number) {
		const node = document.activeElement as HTMLElement;
		if (!node || node.hasAttribute('[data-melt-calendar-date]')) return;
		const allDates = Array.from(
			document.querySelectorAll<HTMLElement>(`[data-melt-calendar-date]:not([data-disabled])`)
		);
		const index = allDates.indexOf(node);
		const nextIndex = index + add;
		const nextDate = allDates[nextIndex];
		if (nextDate) {
			nextDate.focus();
		}
	}

	/**
	 * A helper function to set the year of the active date. This is
	 * useful when the user wants to have a select input to change the
	 * year of the calendar.
	 */
	function setYear(year: number) {
		activeDate.update((prev) => {
			prev.setFullYear(year);
			return prev;
		});
	}

	/**
	 * A helper function to set the month of the active date. This is
	 * useful when the user wants to have a select input to change the
	 * month of the calendar.
	 */
	function setMonth(month: number) {
		if (month < 0 || month > 11) throw new Error('Month must be between 0 and 11');
		activeDate.update((prev) => {
			prev.setMonth(month);
			return prev;
		});
	}

	effect([activeDate], ([$activeDate]) => {
		if (!isBrowser || !$activeDate) return;

		months.set([createMonth($activeDate)]);
		const $numberOfMonths = get(numberOfMonths);
		if ($numberOfMonths > 1) {
			const d = dayjs($activeDate);

			for (let i = 1; i < $numberOfMonths; i++) {
				const nextMonth = d.add(i, 'month').toDate();
				months.update((prev) => {
					prev.push(createMonth(nextMonth));
					return prev;
				});
			}
		}
	});

	const daysOfWeek = derived([months], ([$months]) => {
		if (!$months.length) return [];

		const lastMonthDates = $months[0].lastMonthDates;

		const days = Array.from({ length: 7 - lastMonthDates.length }, (_, i) => {
			const d = dayjs($months[0].dates[i]);
			return d.toDate();
		});

		if (lastMonthDates.length) {
			return lastMonthDates.concat(days);
		}

		return days;
	});

	function createMonth(date: Date): Month {
		const d = dayjs(date);
		const daysInMonth = d.daysInMonth();

		const datesArray = Array.from(
			{ length: daysInMonth },
			(_, i) => new Date(d.date(i + 1).toDate())
		);

		const firstDayOfMonth = d.startOf('month');
		const lastDayOfMonth = d.endOf('month');

		const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth.toDate(), get(weekStartsOn));
		const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth.toDate(), get(weekStartsOn));

		const lastMonthDays = getDaysBetween(
			dayjs(lastSunday).subtract(1, 'day').toDate(),
			firstDayOfMonth.toDate()
		);
		const nextMonthDays = getDaysBetween(
			lastDayOfMonth.toDate(),
			dayjs(nextSaturday).add(1, 'day').toDate()
		);

		const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;

		if (get(fixedWeeks) && totalDays < 42) {
			const extraDays = 42 - totalDays;
			const startFrom = dayjs(nextMonthDays[nextMonthDays.length - 1]);
			const extraDaysArray = Array.from({ length: extraDays }, (_, i) => {
				const incr = i + 1;
				return startFrom.add(incr, 'day').toDate();
			});
			nextMonthDays.push(...extraDaysArray);
		}

		return {
			month: date,
			dates: datesArray,
			nextMonthDates: nextMonthDays,
			lastMonthDates: lastMonthDays,
		};
	}

	function handleSegmentNavigation(e: KeyboardEvent) {
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;

		const { prev, next } = getPrevNextSegments(currentTarget, ids.input);

		if (e.key === kbd.ARROW_LEFT) {
			if (!prev) return;
			prev.focus();
		} else if (e.key === kbd.ARROW_RIGHT) {
			if (!next) return;
			next.focus();
		}
	}

	function moveToNextSegment(e: KeyboardEvent) {
		const node = e.currentTarget;
		if (!isHTMLElement(node)) return;
		const { next } = getPrevNextSegments(node, ids.input);
		if (!next) return;
		next.focus();
	}

	return {
		elements: {
			content,
			date,
			dateInput,
			daySegment,
			monthSegment,
			yearSegment,
			hourSegment,
			minuteSegment,
			secondSegment,
			dayPeriodSegment,
			trigger,
		},
		states: {
			activeDate,
			months,
			value,
			daysOfWeek,
			dayValue,
			monthValue,
			yearValue,
			hourValue,
			minuteValue,
			secondValue,
			dayPeriodValue,
		},
		helpers: {
			nextMonth,
			prevMonth,
			nextYear,
			prevYear,
			setYear,
			setMonth,
		},
		options,
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

function isAcceptableSegmentKey(key: string) {
	if (acceptableKeys.includes(key)) return true;
	if (isNumberKey(key)) return true;
	return false;
}

function isNumberKey(key: string) {
	if (isNaN(parseInt(key))) return false;
	return true;
}

function isSegmentNavigationKey(key: string) {
	if (key === kbd.ARROW_RIGHT || key === kbd.ARROW_LEFT) return true;
	return false;
}

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

function getSegments(id: string) {
	const inputContainer = document.getElementById(id);
	if (!isHTMLElement(inputContainer)) return null;
	const segments = Array.from(inputContainer.querySelectorAll('[data-segment]')).filter(
		(el): el is HTMLElement => isHTMLElement(el)
	);
	return segments;
}

function getNextSegment(node: HTMLElement, segments: HTMLElement[]) {
	const index = segments.indexOf(node);
	if (index === segments.length - 1 || index === -1) return null;
	const nextIndex = index + 1;
	const nextSegment = segments[nextIndex];
	return nextSegment;
}

function getPrevSegment(node: HTMLElement, segments: HTMLElement[]) {
	const index = segments.indexOf(node);
	if (index === 0 || index === -1) return null;
	const prevIndex = index - 1;
	const prevSegment = segments[prevIndex];
	return prevSegment;
}
