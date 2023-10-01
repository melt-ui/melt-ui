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
} from '$lib/internal/helpers';

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
} from './utils';

import { derived, get, writable } from 'svelte/store';
import type { CreateDatePickerProps, DateProps, DateRange, Month } from './types';
import dayjs from 'dayjs';
import { dayJsStore } from './date-store';

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

// selectionStrategy - name for range behavior

type CalendarParts =
	| 'content'
	| 'nextMonth'
	| 'prevMonth'
	| 'nextYear'
	| 'prevYear'
	| 'dateGrid'
	| 'date'
	| 'next'
	| 'prev';
const { name } = createElHelpers<CalendarParts>('calendar');

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
	const today = dayjs(new Date());

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

	let lastClickedDate: Date | null = null;

	const months = writable<Month[]>([]);

	const ids = {
		content: generateId(),
		input: generateId(),
	};

	/**
	 * Navigate to the next page of the calendar.
	 * If using paged navigation, this will move the calendar forward
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar forward
	 * by one month.
	 */
	function nextPage() {
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
	function prevPage() {
		if (get(pagedNavigation)) {
			const $numberOfMonths = get(numberOfMonths);
			activeDate.subtract($numberOfMonths, 'month');
		} else {
			activeDate.subtract(1, 'month');
		}
	}

	/**
	 * Navigate to the previous month of the calendar.
	 */
	function prevMonth() {
		activeDate.subtract(1, 'month');
	}

	/**
	 * Navigate to the next month of the calendar.
	 */
	function nextMonth() {
		activeDate.add(1, 'month');
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

	/**
	 * When using paged navigation, moves the calendar forward
	 * by the number of months specified in the `numberOfMonths` prop.
	 *
	 * When not using paged navigation, move the calendar forward by one month.
	 */
	const nextButton = builder(name('next'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', nextPage);
			return {
				destroy() {
					unsub();
				},
			};
		},
	});

	/**
	 * When using paged navigation, moves the calendar backward
	 * by the number of months specified in the `numberOfMonths` prop.
	 *
	 * When not using paged navigation, move the calendar backward by one month.
	 */
	const prevButton = builder(name('next'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', prevPage);
			return {
				destroy() {
					unsub();
				},
			};
		},
	});

	const nextMonthButton = builder(name('nextMonth'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', nextMonth);

			return {
				destroy() {
					unsub();
				},
			};
		},
	});

	const prevMonthButton = builder(name('prevMonth'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', prevMonth);

			return {
				destroy() {
					unsub();
				},
			};
		},
	});

	const nextYearButton = builder(name('nextYear'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', () => nextYear);
			return {
				destroy() {
					unsub();
				},
			};
		},
	});

	const prevYearButton = builder(name('prevYear'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', prevYear);
			return {
				destroy() {
					unsub();
				},
			};
		},
	});

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
		if (lastClickedDate === null) {
			lastClickedDate = date;
		} else if (isSameDay(lastClickedDate, date)) {
			value.set({
				to: date,
				from: date,
			});
			lastClickedDate = date;
			return;
		} else {
			lastClickedDate = date;
		}

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

			if (isEmpty) {
				return {
					from: date,
					to: date,
				};
			}

			// If the value array of dates has one date and the
			// new date is the same as the existing date
			if (prev.from !== undefined) {
				if (isSame && isSameDay(prev.from, date)) {
					return prev;
				}

				if (isBefore(date, prev.from)) {
					return {
						from: date,
						to: date,
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
			if (!isDateArray(prev)) return prev;
			if (prev.some((d) => isSameDay(d, date))) {
				prev = prev.filter((d) => !isSameDay(d, date));
			} else {
				prev.push(date);
			}

			return prev;
		});
	}

	const date = builder(name('date'), {
		stores: [value, disabled, hidden, activeDate],
		returned: ([$value, $disabled, $hidden, $activeDate]) => {
			return (props: DateProps) => {
				const isDisabled = isMatch(props.value, $disabled);
				const isHidden = isMatch(props.value, $hidden);

				const isToday = dayjs(props.value).isSame(today, 'day');
				const isInCurrentMonth = dayjs(props.value).isSame($activeDate, 'month');

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
					'data-today': isToday ? '' : undefined,
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
			const unsub = addMeltEventListener(node, 'click', () => {
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
			});

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
			nextMonthButton,
			prevMonthButton,
			nextYearButton,
			prevYearButton,
			nextButton,
			prevButton,
			date,
		},
		states: {
			activeDate,
			months,
			value,
			daysOfWeek,
		},
		options,
	};
}
