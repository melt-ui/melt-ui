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
	isBefore,
	isSameDay,
	getDaysBetween,
	isSelected,
	isMatch,
	getLastFirstDayOfWeek,
	getNextLastDayOfWeek,
	isDateArray,
	isSingleDate,
	isDateRange,
	isInSameMonth,
	isToday,
} from '$lib/builders/calendar/utils.js';

import { derived, get, writable } from 'svelte/store';
import type { DateProps, DateRange, Month } from '$lib/builders/index.js';
import type { CreateDatePickerProps } from './types.js';
import dayjs from 'dayjs';
import { dayJsStore } from './date-store.js';

const defaults = {
	disabled: false,
	earliest: undefined,
	latest: undefined,
	mode: 'single',
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
	| 'year-segment';
const { name } = createElHelpers<DatePickerParts>('calendar');

export function createDatePicker(props?: CreateDatePickerProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores({
		...omit(withDefaults, 'value'),
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable<Date | Date[] | DateRange | undefined>(
		valueWritable,
		withDefaults?.onValueChange as ChangeFn<Date | Date[] | DateRange | undefined>
	);
	const activeDate = dayJsStore(options.activeDate);

	const dayValue = writable<number | null>(null);
	const monthValue = writable<number | null>(null);
	const yearValue = writable<number | null>(null);

	const {
		mode,
		allowDeselect,
		disabled,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
		hidden,
	} = options;

	const months = writable<Month[]>([]);

	const ids = {
		content: generateId(),
		input: generateId(),
		daySegment: generateId(),
		monthSegment: generateId(),
		yearSegment: generateId(),
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

	function handleRangeClick(date: Date) {
		value.update((prev) => {
			if (prev === undefined) {
				return {
					from: date,
					to: date,
				};
			}
			if (!isDateRange(prev)) return prev;

			const isEmpty = prev.to === undefined && prev.from === undefined;
			const isSame = prev.to === prev.from;
			const isComplete = !isSame && prev.to !== undefined && prev.from !== undefined;

			if (isEmpty || isComplete) {
				return {
					from: date,
					to: date,
				};
			}

			// If the value array of dates has one date and the
			// new date is the same as the existing date
			if (prev.from !== undefined) {
				if (isSame && isSameDay(prev.from, date)) {
					return undefined;
				}

				if (isBefore(date, prev.from)) {
					return {
						from: date,
						to: prev.from,
					};
				}
				const daysBetween = getDaysBetween(prev.from, date);
				if (daysBetween.some((d) => isMatch(d, get(disabled)))) {
					return prev;
				}
			}
			prev.to = date;
			return prev;
		});
	}

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

	function handleMultipleClick(date: Date) {
		value.update((prev) => {
			if (prev === undefined) {
				return [date];
			}
			if (!isDateArray(prev)) return prev;
			if (prev.some((d) => isSameDay(d, date))) {
				prev = prev.filter((d) => !isSameDay(d, date));
			} else {
				prev.push(date);
			}

			return prev;
		});
	}

	const dateInput = builder(name('date-input'), {
		returned: () => {
			return {
				role: 'group',
			};
		},
		action: (node: HTMLElement) => {
			//
		},
	});

	const daySegment = builder(name('day-segment'), {
		stores: [activeDate, dayValue],
		returned: ([$activeDate, $dayValue]) => {
			const activeDay = dayjs($activeDate).date();
			const valueMin = 1;
			const valueMax = dayjs($activeDate).daysInMonth();

			return {
				role: 'spinbutton',
				id: ids.daySegment,
				'aria-label': 'day, ',
				contenteditable: true,
				'aria-valuemin': valueMin,
				'aria-valuemax': valueMax,
				'aria-valuenow': $dayValue ?? activeDay,
				'aria-valuetext': $dayValue ?? 'Empty',
				tabindex: 0,
				spellcheck: false,
				inputmode: 'numeric',
				autocorrect: 'off',
				enterkeyhint: 'next',
				'data-type': 'day',
			};
		},
		action: (node: HTMLElement) => {
			node.style.caretColor = 'transparent';
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					if (!isAcceptableSegmentKey(e.key)) {
						e.preventDefault();
						return;
					}
					const next = document.getElementById(ids.monthSegment);

					const $activeDate = get(activeDate);
					const activeDjs = dayjs($activeDate);

					if (e.key === kbd.ARROW_UP) {
						e.preventDefault();
						dayValue.update((prev) => {
							if (prev === null || prev === activeDjs.daysInMonth()) return 1;
							return prev + 1;
						});
						return;
					}
					if (e.key === kbd.ARROW_DOWN) {
						e.preventDefault();
						dayValue.update((prev) => {
							if (prev === null || prev === 1) {
								return activeDjs.daysInMonth();
							}
							return prev - 1;
						});
						return;
					}

					if (isNumberKey(e.key)) {
						e.preventDefault();
						const num = parseInt(e.key);
						let moveToNext = false;
						dayValue.update((prev) => {
							const max = activeDjs.daysInMonth();
							const maxStart = Math.floor(max / 10);
							if (prev === null) {
								if (num > maxStart) {
									moveToNext = true;
								}
								return num;
							}

							const str = prev.toString() + num.toString();
							let int = parseInt(str);
							if (int > max) {
								int = num;
							}
							if (int > maxStart) {
								moveToNext = true;
							}
							return int;
						});

						if (moveToNext) {
							if (!isHTMLElement(next)) return;
							next.focus();
						}
					}

					if (e.key === kbd.BACKSPACE) {
						e.preventDefault();
						dayValue.update((prev) => {
							if (prev === null) return null;
							const str = prev.toString();
							if (str.length === 1) return null;
							return parseInt(str.slice(0, -1));
						});
					}

					if (e.key === kbd.ARROW_RIGHT) {
						e.preventDefault();
						if (!isHTMLElement(next)) return;
						next.focus();
					}
				})
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
				role: 'spinbutton',
				tabindex: 0,
				id: ids.monthSegment,
				'aria-label': 'day, ',
				contenteditable: true,
				'aria-valuemin': valueMin,
				'aria-valuemax': valueMax,
				'aria-valuenow': $monthValue ?? `${activeMonth + 1} - ${activeMonthString}`,
				'aria-valuetext': $monthValue ?? 'Empty',
				spellcheck: false,
				inputmode: 'numeric',
				autocorrect: 'off',
				enterkeyhint: 'next',
				'data-type': 'day',
			};
		},
		action: (node: HTMLElement) => {
			node.style.caretColor = 'transparent';
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					if (!isAcceptableSegmentKey(e.key)) {
						e.preventDefault();
						return;
					}
					const next = document.getElementById(ids.yearSegment);

					const max = 12;
					const min = 1;

					if (e.key === kbd.ARROW_UP) {
						e.preventDefault();
						monthValue.update((prev) => {
							if (prev === null || prev === max) return 1;
							return prev + 1;
						});
						return;
					}
					if (e.key === kbd.ARROW_DOWN) {
						e.preventDefault();
						monthValue.update((prev) => {
							if (prev === null || prev === min) {
								return 12;
							}
							return prev - 1;
						});
						return;
					}

					if (isNumberKey(e.key)) {
						e.preventDefault();
						const num = parseInt(e.key);
						let moveToNext = false;
						monthValue.update((prev) => {
							const maxStart = Math.floor(max / 10);
							if (prev === null) {
								if (num > maxStart) {
									moveToNext = true;
								}
								return num;
							}

							const str = prev.toString() + num.toString();
							let int = parseInt(str);
							if (int > max) {
								int = num;
							}
							if (int > maxStart) {
								moveToNext = true;
							}
							return int;
						});

						if (moveToNext) {
							if (!isHTMLElement(next)) return;
							next.focus();
						}
					}

					if (e.key === kbd.BACKSPACE) {
						e.preventDefault();
						monthValue.update((prev) => {
							if (prev === null) return null;
							const str = prev.toString();
							if (str.length === 1) return null;
							return parseInt(str.slice(0, -1));
						});
					}

					if (e.key === kbd.ARROW_RIGHT) {
						e.preventDefault();
						if (!isHTMLElement(next)) return;
						next.focus();
					}
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const yearSegment = builder(name('year-segment'), {
		stores: [activeDate, yearValue],
		returned: ([$activeDate, $yearValue]) => {
			return {
				id: ids.yearSegment,
				tabindex: '0',
				role: 'spinbutton',
			};
		},
		action: (node: HTMLElement) => {
			node.style.caretColor = 'transparent';
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					if (!isAcceptableSegmentKey(e.key)) {
						e.preventDefault();
						return;
					}

					const $activeDate = get(activeDate);
					const activeDjs = dayjs($activeDate);
					const min = 0;

					if (e.key === kbd.ARROW_UP) {
						e.preventDefault();
						yearValue.update((prev) => {
							if (prev === null) return activeDjs.get('year');
							return prev + 1;
						});
						return;
					}
					if (e.key === kbd.ARROW_DOWN) {
						e.preventDefault();
						yearValue.update((prev) => {
							if (prev === null || prev === min) {
								return activeDjs.get('year');
							}
							return prev - 1;
						});
						return;
					}

					if (isNumberKey(e.key)) {
						e.preventDefault();
						const num = parseInt(e.key);
						yearValue.update((prev) => {
							if (prev === null) {
								return num;
							}
							const str = prev.toString() + num.toString();
							if (str.length > 4) return num;

							const int = parseInt(str);

							return int;
						});
					}

					if (e.key === kbd.BACKSPACE) {
						e.preventDefault();
						yearValue.update((prev) => {
							if (prev === null) return null;
							const str = prev.toString();
							if (str.length === 1) return null;
							return parseInt(str.slice(0, -1));
						});
					}

					if (e.key === kbd.ARROW_RIGHT) {
						e.preventDefault();
					}
				})
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

					switch (get(mode)) {
						case 'single':
							handleSingleClick(date);
							break;
						case 'range':
							handleRangeClick(date);
							break;
						case 'multiple':
							handleMultipleClick(date);
							break;
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

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

	return {
		elements: {
			content,
			date,
			dateInput,
			daySegment,
			monthSegment,
			yearSegment,
		},
		states: {
			activeDate,
			months,
			value,
			daysOfWeek,
			dayValue,
			monthValue,
			yearValue,
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
	kbd.TAB,
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
