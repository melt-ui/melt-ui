import {
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	isHTMLElement,
	kbd,
	toWritableStores,
	omit,
	executeCallbacks,
	styleToString,
	chunk,
	overridable,
	isValidIndex,
} from '$lib/internal/helpers/index.js';
import {
	getDaysBetween,
	getDaysBetweenIfAllValid,
	getLastFirstDayOfWeek,
	getNextLastDayOfWeek,
	isCalendarCell,
} from './utils.js';
import { derived, get, writable } from 'svelte/store';
import type { CalendarIds, CreateRangeCalendarProps, Month } from './types.js';
import { tick } from 'svelte';
import {
	defaultMatcher,
	getAnnouncer,
	isBefore,
	isBetweenInclusive,
	toDate,
	dateStore,
	createFormatter,
	getDaysInMonth,
	getDefaultDate,
} from '$lib/internal/date/index.js';
import {
	type DateValue,
	getLocalTimeZone,
	isToday,
	isSameMonth,
	isSameDay,
	startOfMonth,
	endOfMonth,
	ZonedDateTime,
	parseZonedDateTime,
	CalendarDateTime,
	parseDateTime,
	parseDate,
} from '@internationalized/date';

const defaults = {
	isDisabled: defaultMatcher,
	isUnavailable: defaultMatcher,
	value: undefined,
	defaultValue: {
		start: undefined,
		end: undefined,
	},
	allowDeselect: false,
	numberOfMonths: 1,
	pagedNavigation: false,
	weekStartsOn: 0,
	fixedWeeks: false,
	calendarLabel: 'Event Date',
	locale: 'en',
} satisfies CreateRangeCalendarProps;

/**
 * For internal use only.
 * @internal
 */
type CalendarParts = 'content' | 'nextButton' | 'prevButton' | 'grid' | 'cell' | 'heading';

const { name } = createElHelpers<CalendarParts>('calendar');

export function createRangeCalendar<T extends DateValue = DateValue>(
	props?: CreateRangeCalendarProps
) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores({
		...omit(withDefaults, 'value', 'placeholderValue'),
	});

	const {
		allowDeselect,
		isDisabled,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
		calendarLabel,
		isUnavailable,
		locale,
	} = options;

	const ids = {
		calendar: generateId(),
		grid: generateId(),
		accessibleHeading: generateId(),
	} satisfies CalendarIds;

	const defaultDate = getDefaultDate({
		defaultValue: withDefaults.defaultValue.start,
		defaultPlaceholderValue: withDefaults.defaultPlaceholderValue,
	});
	const formatter = createFormatter(get(locale));

	const defaultStart = withDefaults.value ? get(withDefaults.value).start : undefined;
	const startValue = writable<DateValue | undefined>(
		defaultStart ?? withDefaults.defaultValue.start
	);

	const defaultEnd = withDefaults.value ? get(withDefaults.value).end : undefined;
	const endValue = writable<DateValue | undefined>(defaultEnd ?? withDefaults.defaultValue.end);

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const placeholderValueWritable =
		withDefaults.placeholderValue ?? writable(withDefaults.defaultPlaceholderValue ?? defaultDate);
	const placeholderValue = dateStore(
		overridable(placeholderValueWritable, withDefaults.onPlaceholderValueChange),
		withDefaults.defaultPlaceholderValue ?? defaultDate
	);

	const focusedValue = writable<DateValue | null>(null);

	const months = writable<Month<DateValue>[]>([
		createMonth(withDefaults.defaultPlaceholderValue ?? defaultDate),
	]);

	const isStartInvalid = derived(
		[startValue, isUnavailable, isDisabled],
		([$startValue, $isUnavailable, $isDisabled]) => {
			if (!$startValue) return false;
			return $isUnavailable?.($startValue) || $isDisabled?.($startValue);
		}
	);
	const isEndInvalid = derived(
		[endValue, isUnavailable, isDisabled],
		([$endValue, $isUnavailable, $isDisabled]) => {
			if (!$endValue) return false;
			return $isUnavailable?.($endValue) || $isDisabled?.($endValue);
		}
	);

	const isInvalid = derived(
		[startValue, endValue, isEndInvalid, isStartInvalid],
		([$startValue, $endValue, $isEndInvalid, $isStartInvalid]) => {
			if ($isStartInvalid || $isEndInvalid) {
				return true;
			}
			if ($endValue && $startValue && isBefore($endValue, $startValue)) {
				return true;
			}
			return false;
		}
	);

	let announcer = getAnnouncer();

	const headingValue = derived([months, locale], ([$months, $locale]) => {
		if (!$months.length) return '';
		if ($locale !== formatter.getLocale()) {
			formatter.setLocale($locale);
		}
		if ($months.length === 1) {
			const month = $months[0].monthDate;
			return `${formatter.fullMonthAndYear(month)}`;
		}

		const startMonth = $months[0].monthDate;
		const endMonth = $months[$months.length - 1].monthDate;

		const startMonthName = formatter.fullMonth(startMonth);
		const endMonthName = formatter.fullMonth(endMonth);
		const startMonthYear = formatter.fullYear(startMonth);
		const endMonthYear = formatter.fullYear(endMonth);

		const content =
			startMonthYear === endMonthYear
				? `${startMonthName} - ${endMonthName} ${endMonthYear}`
				: `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;

		return content;
	});

	const fullCalendarLabel = derived(
		[headingValue, calendarLabel],
		([$headingValue, $calendarLabel]) => {
			return `${$calendarLabel}, ${$headingValue}`;
		}
	);

	const calendar = builder(name(), {
		stores: [fullCalendarLabel, isInvalid],
		returned: ([$fullCalendarLabel, $isInvalid]) => {
			return {
				id: ids.calendar,
				role: 'application',
				'aria-label': $fullCalendarLabel,
				'data-invalid': $isInvalid ? '' : undefined,
			};
		},
		action: (node: HTMLElement) => {
			/**
			 * Create the accessible heading for the calendar
			 * when the grid is mounted. The label is updated
			 * via an effect when the active date or label changes.
			 */
			createAccessibleHeading(node, get(fullCalendarLabel));
			announcer = getAnnouncer();

			const unsubKb = addMeltEventListener(node, 'keydown', handleCalendarKeydown);

			return {
				destroy() {
					unsubKb();
				},
			};
		},
	});

	const heading = builder(name('heading'), {
		returned: () => {
			return {
				'aria-hidden': true,
			};
		},
	});

	const grid = builder(name('grid'), {
		returned: () => ({ tabindex: -1, id: ids.grid, role: 'grid' }),
	});

	const prevButton = builder(name('prevButton'), {
		returned: () => {
			return {
				role: 'button',
				'aria-label': 'Previous',
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					prevPage();
				})
			);
			return {
				destroy: unsub,
			};
		},
	});

	const nextButton = builder(name('nextButton'), {
		returned: () => {
			return {
				role: 'button',
				'aria-label': 'Next',
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					nextPage();
				})
			);
			return {
				destroy: unsub,
			};
		},
	});

	const isSelectionStart = derived([startValue], ([$startValue]) => {
		return (date: DateValue) => {
			if (!$startValue) return false;
			return isSameDay($startValue, date);
		};
	});

	const isSelectionEnd = derived([endValue], ([$endValue]) => {
		return (date: DateValue) => {
			if (!$endValue) return false;
			return isSameDay($endValue, date);
		};
	});

	const isSelected = derived([startValue, endValue], ([$startValue, $endValue]) => {
		return (date: DateValue) => {
			if ($startValue && isSameDay($startValue, date)) return true;
			if ($endValue && isSameDay($endValue, date)) return true;
			if ($endValue && $startValue) {
				return isBetweenInclusive(date, $startValue, $endValue);
			}
			return false;
		};
	});

	const highlightedRange = derived(
		[startValue, endValue, focusedValue, isDisabled, isUnavailable],
		([$startValue, $endValue, $focusedValue, $isDisabled, $isUnavailable]) => {
			if ($startValue && $endValue) return null;
			if (!$startValue || !$focusedValue) return null;
			const isStartBeforeFocused = isBefore($startValue, $focusedValue);
			const start = isStartBeforeFocused ? $startValue : $focusedValue;
			const end = isStartBeforeFocused ? $focusedValue : $startValue;

			if (isSameDay(start.add({ days: 1 }), end)) {
				return {
					start: start,
					end: end,
				};
			}

			const range = getDaysBetweenIfAllValid(start, end, $isUnavailable, $isDisabled);
			if (range.length) {
				return {
					start: start,
					end: end,
				};
			}
			return null;
		}
	);

	/**
	 * An individual date cell in the calendar grid, which represents a
	 * single day in the month.
	 */
	const cell = builder(name('cell'), {
		stores: [
			isSelected,
			isSelectionEnd,
			isSelectionStart,
			highlightedRange,
			isDisabled,
			isUnavailable,
			placeholderValue,
		],
		returned: ([
			$isSelected,
			$isSelectionEnd,
			$isSelectionStart,
			$highlightedRange,
			$disabled,
			$unavailable,
			$placeholderValue,
		]) => {
			return (cellValue: T) => {
				const cellDate = toDate(cellValue);
				const isDisabled = $disabled?.(cellValue);
				const isUnavailable = $unavailable?.(cellValue);
				const isDateToday = isToday(cellValue, getLocalTimeZone());
				const isOutsideMonth = !isSameMonth(cellValue, $placeholderValue);
				const isFocusedDate = isSameDay(cellValue, $placeholderValue);
				const isSelectedDate = $isSelected(cellValue);
				const isSelectionStart = $isSelectionStart(cellValue);
				const isSelectionEnd = $isSelectionEnd(cellValue);
				const isHighlighted = $highlightedRange
					? isBetweenInclusive(cellValue, $highlightedRange.start, $highlightedRange.end)
					: false;

				const labelText = formatter.custom(cellDate, {
					weekday: 'long',
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				});

				return {
					role: 'button',
					'aria-label': labelText,
					'aria-selected': isSelectedDate ? true : undefined,
					'aria-disabled': isOutsideMonth || isDisabled || isUnavailable ? true : undefined,
					'data-selected': isSelectedDate ? true : undefined,
					'data-selection-start': isSelectionStart ? true : undefined,
					'data-selection-end': isSelectionEnd ? true : undefined,
					'data-value': cellValue.toString(),
					'data-disabled': isDisabled || isOutsideMonth ? '' : undefined,
					'data-unavailable': isUnavailable ? '' : undefined,
					'data-today': isDateToday ? '' : undefined,
					'data-outside-month': isOutsideMonth ? '' : undefined,
					'data-focused': isFocusedDate ? '' : undefined,
					'data-highlighted': isHighlighted ? '' : undefined,
					tabindex: isFocusedDate ? 0 : isOutsideMonth || isDisabled ? undefined : -1,
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
				addMeltEventListener(node, 'click', (e) => {
					const args = getElArgs();
					if (args.disabled) return;
					if (!args.value) return;
					handleCellClick(e, parseToDateObj(args.value));
				}),
				addMeltEventListener(node, 'mouseenter', () => {
					const args = getElArgs();
					if (args.disabled) return;
					if (!args.value) return;
					focusedValue.set(parseToDateObj(args.value));
				}),
				addMeltEventListener(node, 'focusin', () => {
					const args = getElArgs();
					if (args.disabled) return;
					if (!args.value) return;
					focusedValue.set(parseToDateObj(args.value));
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	effect([locale], ([$locale]) => {
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	effect([placeholderValue], ([$placeholderValue]) => {
		if (!isBrowser || !$placeholderValue) return;

		months.set([createMonth($placeholderValue)]);
		const $numberOfMonths = get(numberOfMonths);
		if ($numberOfMonths > 1) {
			for (let i = 1; i < $numberOfMonths; i++) {
				const nextMonth = $placeholderValue.add({ months: i });
				months.update((prev) => {
					prev.push(createMonth(nextMonth));
					return prev;
				});
			}
		}
	});

	/**
	 * Update the accessible heading's text content when the
	 * `fullCalendarLabel` store changes.
	 */
	effect([fullCalendarLabel], ([$fullCalendarLabel]) => {
		if (!isBrowser) return;
		const node = document.getElementById(ids.accessibleHeading);
		if (!isHTMLElement(node)) return;
		node.textContent = $fullCalendarLabel;
	});

	effect([startValue], ([$startValue]) => {
		if ($startValue && get(placeholderValue) !== $startValue) {
			placeholderValue.set($startValue);
		}
	});

	/**
	 * A derived store whose value is an array days of the week
	 * for the current locale and calendar view.
	 *
	 * This remains in sync with the `weekStartsOn` prop, so if it is
	 * changed, this store and the calendar will update accordingly.
	 *
	 * If you prefer to format/render the days of the week yourself,
	 * you can do so by accessing the first week of the first month,
	 * and mapping over the dates to get/format each day of the week.
	 */
	const daysOfWeek = derived([months], ([$months]) => {
		if (!$months.length) return [];
		return $months[0].weeks[0].map((date) => {
			return formatter.dayOfWeek(toDate(date));
		});
	});

	/**
	 * Given a date, this function will return an object containing
	 * the necessary values to render a calendar month, including
	 * the month's date, which can be used to render the name of the
	 * month, the dates within that month, and the dates from the
	 * previous and next months that are needed to fill out the
	 * calendar grid.
	 */
	function createMonth(dateObj: DateValue): Month<DateValue> {
		const tz = getLocalTimeZone();
		const date = dateObj instanceof ZonedDateTime ? dateObj.toDate() : dateObj.toDate(tz);
		const daysInMonth = getDaysInMonth(date);

		const datesArray = Array.from({ length: daysInMonth }, (_, i) => dateObj.set({ day: i + 1 }));

		const firstDayOfMonth = startOfMonth(dateObj);
		const lastDayOfMonth = endOfMonth(dateObj);

		const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth, get(weekStartsOn), get(locale));
		const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth, get(weekStartsOn), get(locale));

		const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth);
		const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }));

		const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;

		if (get(fixedWeeks) && totalDays < 42) {
			const extraDays = 42 - totalDays;

			const startFrom = nextMonthDays[nextMonthDays.length - 1];
			const extraDaysArray = Array.from({ length: extraDays }, (_, i) => {
				const incr = i + 1;
				return startFrom.add({ days: incr });
			});
			nextMonthDays.push(...extraDaysArray);
		}

		const allDays = lastMonthDays.concat(datesArray, nextMonthDays);

		const weeks = chunk(allDays, 7);

		return {
			monthDate: date,
			dates: allDays,
			weeks,
		};
	}

	/**
	 * Creates an accessible heading for the calendar so when it
	 * is focused by a screen reader, the date range being displayed
	 * is announced.
	 */
	function createAccessibleHeading(node: HTMLElement, label: string) {
		if (!isBrowser) return;
		const div = document.createElement('div');
		div.style.cssText = styleToString({
			border: '0px',
			clip: 'rect(0px, 0px, 0px, 0px)',
			'clip-path': 'inset(50%)',
			height: '1px',
			margin: '-1px',
			overflow: 'hidden',
			padding: '0px',
			position: 'absolute',
			'white-space': 'nowrap',
			width: '1px',
		});
		const h2 = document.createElement('h2');
		h2.textContent = label;
		h2.id = ids.accessibleHeading;
		node.insertBefore(div, node.firstChild);
		div.appendChild(h2);
	}

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
			placeholderValue.nextPage($numberOfMonths);
		} else {
			placeholderValue.nextPage(1);
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
			placeholderValue.prevPage($numberOfMonths);
		} else {
			placeholderValue.prevPage(1);
		}
	}

	/**
	 * Navigate to the previous year of the calendar.
	 */
	function nextYear() {
		placeholderValue.add({ years: 1 });
	}

	/**
	 * Navigate to the next year of the calendar.
	 */
	function prevYear() {
		placeholderValue.subtract({ years: 1 });
	}

	const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT];

	/**
	 * A helper function to set the year of the active date. This is
	 * useful when the user wants to have a select input to change the
	 * year of the calendar.
	 */
	function setYear(year: number) {
		placeholderValue.setDate({ year: year });
	}

	/**
	 * A helper function to set the month of the active date. This is
	 * useful when the user wants to have a select input to change the
	 * month of the calendar.
	 */
	function setMonth(month: number) {
		if (month < 0 || month > 11) throw new Error('Month must be between 0 and 11');
		placeholderValue.setDate({ month: month });
	}

	function handleCellClick(e: Event, date: DateValue) {
		const $startValue = get(startValue);
		const $endValue = get(endValue);
		const $highlightedRange = get(highlightedRange);

		if ($startValue && $highlightedRange === null) {
			if (isSameDay($startValue, date) && get(allowDeselect) && !$endValue) {
				startValue.set(undefined);
				placeholderValue.set(date);
				announcer.announce('Selected date is now empty.', 'polite');
				return;
			} else if (!$endValue) {
				e.preventDefault();
				focusedValue.set($startValue);
				return;
			}
		}

		if ($startValue && isSameDay($startValue, date) && get(allowDeselect) && !$endValue) {
			startValue.set(undefined);
			placeholderValue.set(date);
			announcer.announce('Selected date is now empty.', 'polite');
			return;
		}

		if (!$startValue) {
			startValue.update(() => {
				announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, 'polite');
				return date;
			});
		} else if (!$endValue) {
			endValue.update(() => {
				announcer.announce(
					`Selected Dates: ${formatter.selectedDate(
						$startValue,
						false
					)} to ${formatter.selectedDate(date, false)}`,
					'polite'
				);
				return date;
			});
		} else if ($endValue && $startValue) {
			endValue.set(undefined);
			startValue.update(() => {
				announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, 'polite');
				return date;
			});
		}
	}

	const SELECT_KEYS = [kbd.ENTER, kbd.SPACE];

	function handleCalendarKeydown(e: KeyboardEvent) {
		const currentCell = e.target;
		if (!isCalendarCell(currentCell)) return;
		if (!ARROW_KEYS.includes(e.key) && !SELECT_KEYS.includes(e.key)) return;

		e.preventDefault();
		// the cell that is currently focused

		if (e.key === kbd.ARROW_DOWN) {
			shiftFocus(currentCell, 7);
		}
		if (e.key === kbd.ARROW_UP) {
			shiftFocus(currentCell, -7);
		}
		if (e.key === kbd.ARROW_LEFT) {
			shiftFocus(currentCell, -1);
		}
		if (e.key === kbd.ARROW_RIGHT) {
			shiftFocus(currentCell, 1);
		}

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			const cellValue = currentCell.getAttribute('data-value');
			if (!cellValue) return;

			handleCellClick(e, parseToDateObj(cellValue));
		}
	}

	function shiftFocus(node: HTMLElement, add: number) {
		// TODO: Determine if this is okay when using paged navigation
		// with multiple months.
		const candidateCells = getSelectableCells();
		if (!candidateCells.length) {
			return;
		}

		const index = candidateCells.indexOf(node);
		const nextIndex = index + add;

		/**
		 * If the next cell is within the bounds of the
		 * displayed/rendered cells, easy day, just focus it.
		 */
		if (isValidIndex(nextIndex, candidateCells)) {
			const nextCell = candidateCells[nextIndex];
			handlePlaceholderValue(nextCell);
			return nextCell.focus();
		}

		/**
		 * If the next cell is outside the bounds of the
		 * displayed/rendered cells, we need to updated the focused
		 * value to the prev/next month depending on the direction,
		 * and then focus the appropriate cell.
		 */

		if (nextIndex < 0) {
			/**
			 * Since we're in the negative index range, we need to
			 * go back a month, refetch the candidate cells within that
			 * month, and then starting at the end of that array, shift
			 * focus by the difference between the nextIndex
			 */

			// shift the calendar back a month
			placeholderValue.subtract({ months: 1 });

			// Without a tick here, it seems to be too fast for
			// the DOM to update, with the tick it works great
			tick().then(() => {
				const newCandidateCells = getSelectableCells();
				if (!newCandidateCells.length) {
					return;
				}

				// starting at the end of the array, shift focus by the nextIndex amount
				// since in this case, nextIndex is negative, we'll convert it to a positive
				// before subtracting it from the length of the array
				const newIndex = newCandidateCells.length - Math.abs(nextIndex);
				if (isValidIndex(newIndex, newCandidateCells)) {
					const newCell = newCandidateCells[newIndex];
					handlePlaceholderValue(newCell);
					return newCell.focus();
				}
			});
		}

		if (nextIndex >= candidateCells.length) {
			/**
			 * Since we're in the positive index range, we need to
			 * go forward a month, refetch the candidate cells within that
			 * month, and then starting at the beginning of that array,
			 * shift focus by the nextIndex amount.
			 */

			// shift the calendar forward a month
			placeholderValue.add({ months: 1 });

			tick().then(() => {
				const newCandidateCells = getSelectableCells();
				if (!newCandidateCells.length) {
					return;
				}

				/**
				 * We need to determine how far into the next month we need to go
				 * to get the next index. So if we only went over the previous month
				 * by 1, we need to go into the next month by 1 to get the right index.
				 */
				const newIndex = nextIndex - candidateCells.length;

				if (isValidIndex(newIndex, newCandidateCells)) {
					const nextCell = newCandidateCells[newIndex];
					return nextCell.focus();
				}
			});
		}
	}

	function getSelectableCells() {
		const node = document.getElementById(ids.calendar);
		if (!node) return [];
		const selectableSelector = `[data-melt-calendar-cell]:not([data-disabled]):not([data-outside-month])`;

		return Array.from(node.querySelectorAll(selectableSelector)).filter((el): el is HTMLElement =>
			isHTMLElement(el)
		);
	}

	/**
	 * A helper function to extract the date from the `data-value`
	 * attribute of a date cell and set it as the placeholder value.
	 */
	function handlePlaceholderValue(node: HTMLElement) {
		const cellValue = node.getAttribute('data-value');
		if (!cellValue) return;
		placeholderValue.set(parseToDateObj(cellValue));
	}

	function parseToDateObj(dateStr: string): DateValue {
		const $placeholderValue = get(placeholderValue);
		if ($placeholderValue instanceof ZonedDateTime) {
			return parseZonedDateTime(dateStr);
		}
		if ($placeholderValue instanceof CalendarDateTime) {
			return parseDateTime(dateStr);
		}
		return parseDate(dateStr);
	}

	/**
	 * A helper function to determine if a date is disabled,
	 * which uses the `Matcher`(s) provided via the `disabled`
	 * prop, as well as other internal logic, such as if the
	 * date is outside of the current month.
	 *
	 * Although we set attributes on the cells themselves, this
	 * function is useful when you want to conditionally handle
	 * something outside of the cell, such as its wrapping element.
	 *
	 * @example
	 * ```svelte
	 * {#each dates as date}
	 * <td role="gridcell" aria-disabled={$isDisabled(date)}>
	 * 	<!-- ... -->
	 * </td>
	 * {/each}
	 * ```
	 *
	 * @param date - The `DateValue` to check
	 * @returns `true` if the date is disabled, `false` otherwise
	 */
	const isDateDisabled = derived(
		[isDisabled, placeholderValue],
		([$isDisabled, $placeholderValue]) => {
			return (date: DateValue) => {
				if ($isDisabled?.(date)) return true;
				if (!isSameMonth(date, $placeholderValue)) return true;
				return false;
			};
		}
	);

	/**
	 * A helper function to determine if a date is unavailable,
	 * which uses the `Matcher`(s) provided via the `unavailable`
	 * prop.
	 *
	 * Although we set attributes on the cells themselves, this
	 * function is useful when you want to conditionally handle
	 * something outside of the cell, such as its wrapping element.
	 *
	 * @example
	 * ```svelte
	 * {#each dates as date}
	 * <td role="gridcell">
	 * 	{#if $isUnavailable(date)}
	 * 		X
	 * 	{/if}
	 * 	<!-- ... -->
	 * </td>
	 * {/each}
	 * ```
	 *
	 * @param date - The `DateValue` to check
	 * @returns `true` if the date is disabled, `false` otherwise
	 */
	const isDateUnavailable = derived(isUnavailable, ($isUnavailable) => {
		return (date: DateValue) => $isUnavailable?.(date);
	});

	/**
	 * Synchronize the `value` store with the individual `startValue`
	 * and `endValue` stores that are used by the individual date fields.
	 *
	 * We only want to update the `value` store when both the `startValue`
	 * and `endValue` stores are not `undefined`. This is because the
	 * `value` store is used to determine if the date field is completed,
	 * and we don't want to mark the date field as completed until both
	 * the start and end dates have been selected.
	 */

	effect([value], ([$value]) => {
		const $startValue = get(startValue);
		const $endValue = get(endValue);

		if ($value.start && $value.end) {
			if ($value.start !== $startValue) {
				startValue.set($value.start);
			}
			if ($value.end !== $endValue) {
				endValue.set($value.end);
			}
			return;
		}
	});

	effect([startValue, endValue], ([$startValue, $endValue]) => {
		if (!$startValue || !$endValue) return;
	});

	effect([startValue, endValue], ([$startValue, $endValue]) => {
		if ($startValue && $endValue) {
			valueWritable.update((prev) => {
				if (prev.start === $startValue && prev.end === $endValue) {
					return prev;
				}
				if (isBefore($endValue, $startValue)) {
					return {
						start: $endValue,
						end: $startValue,
					};
				} else {
					return {
						start: $startValue,
						end: $endValue,
					};
				}
			});
		} else {
			valueWritable.set({
				start: undefined,
				end: undefined,
			});
		}
	});

	return {
		elements: {
			calendar,
			heading,
			grid,
			cell,
			nextButton,
			prevButton,
		},
		states: {
			placeholderValue: placeholderValue.toWritable(),
			months,
			daysOfWeek,
			headingValue,
			value,
		},
		helpers: {
			nextPage,
			prevPage,
			nextYear,
			prevYear,
			setYear,
			setMonth,
			isDateDisabled,
			isDateUnavailable,
		},
		options,
		ids,
	};
}
