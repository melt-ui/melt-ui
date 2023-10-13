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
	overridable,
	isValidIndex,
} from '$lib/internal/helpers/index.js';

import { derived, get, writable } from 'svelte/store';
import type { CalendarIds, CreateCalendarProps } from './types.js';
import { tick } from 'svelte';
import {
	createMonths,
	getAnnouncer,
	isCalendarCell,
	parseStringToDateValue,
	toDate,
	type Month,
	isBefore,
	isAfter,
	getSelectableCells,
	setPlaceholderToNodeValue,
} from '$lib/internal/helpers/date/index.js';
import {
	type DateValue,
	getLocalTimeZone,
	isToday,
	isSameMonth,
	isSameDay,
} from '@internationalized/date';
import { dateStore, createFormatter, getDefaultDate } from '$lib/internal/helpers/date/index.js';

const defaults = {
	isDisabled: undefined,
	isUnavailable: undefined,
	value: undefined,
	allowDeselect: false,
	numberOfMonths: 1,
	pagedNavigation: false,
	weekStartsOn: 0,
	fixedWeeks: false,
	calendarLabel: 'Event Date',
	locale: 'en',
	minValue: undefined,
	maxValue: undefined,
} satisfies CreateCalendarProps;

type CalendarParts = 'content' | 'nextButton' | 'prevButton' | 'grid' | 'cell' | 'heading';

const { name } = createElHelpers<CalendarParts>('calendar');

export function createCalendar<T extends DateValue = DateValue>(props?: CreateCalendarProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores({
		...omit(withDefaults, 'value', 'placeholder'),
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
		minValue,
		maxValue,
	} = options;

	const ids = {
		calendar: generateId(),
		grid: generateId(),
		accessibleHeading: generateId(),
	} satisfies CalendarIds;

	const defaultDate = getDefaultDate({
		defaultPlaceholder: withDefaults.defaultPlaceholder,
		defaultValue: withDefaults.defaultValue,
	});

	const formatter = createFormatter(withDefaults.locale);
	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const placeholderWritable =
		withDefaults.placeholder ?? writable(withDefaults.defaultPlaceholder ?? defaultDate);
	const placeholder = dateStore(
		overridable(placeholderWritable, withDefaults.onPlaceholderChange),
		withDefaults.defaultPlaceholder ?? defaultDate
	);

	/**
	 * A store containing the months to display in the calendar.
	 */
	const months = writable<Month<DateValue>[]>(
		createMonths({
			dateObj: withDefaults.defaultPlaceholder ?? defaultDate,
			weekStartsOn: withDefaults.weekStartsOn,
			locale: withDefaults.locale,
			fixedWeeks: withDefaults.fixedWeeks,
			numberOfMonths: withDefaults.numberOfMonths,
		})
	);

	/**
	 * A derived store that maintains the currently visible months in the calendar,
	 * which we use to determine how keyboard navigation and if we should apply
	 * `data-outside-month` to cells.
	 */
	const visibleMonths = derived([months], ([$months]) => {
		return $months.map((month) => {
			return month.value;
		});
	});

	const isOutsideVisibleMonths = derived([visibleMonths], ([$visibleMonths]) => {
		return (date: DateValue) => {
			return !$visibleMonths.some((month) => isSameMonth(date, month));
		};
	});

	/**
	 * A derived helper store that evaluates to true if the currently selected date is invalid.
	 */
	const isInvalid = derived(
		[value, isDisabled, isUnavailable],
		([$value, $isDisabled, $isUnavailable]) => {
			if (!$value) return false;
			if ($isDisabled?.($value)) return true;
			if ($isUnavailable?.($value)) return true;
			return false;
		}
	);

	/**
	 * Initialize the announcer, which currently remains inactive in this context since it will
	 * be server-side rendered, but we'll initialize it in the calendar's action.
	 *
	 * The announcer is in charge of providing `aria-live` announcements for the calendar,
	 * such as when a date is selected.
	 */
	let announcer = getAnnouncer();

	/**
	 * The current heading value for the calendar, meant to be utilized with
	 * the {@link heading} builder.
	 * It renders the current displayed month and year, formatted for the current locale.
	 * This value updates automatically as the user navigates the calendar, even when
	 * displaying multiple months using the `numberOfMonths` prop.
	 */
	const headingValue = derived([months, locale], ([$months, $locale]) => {
		if (!$months.length) return '';
		if ($locale !== formatter.getLocale()) {
			formatter.setLocale($locale);
		}
		if ($months.length === 1) {
			const month = $months[0].value;
			return `${formatter.fullMonthAndYear(toDate(month))}`;
		}

		const startMonth = toDate($months[0].value);
		const endMonth = toDate($months[$months.length - 1].value);

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

	/**
	 * The accessible heading label for the calendar, generated by combining the `calendarLabel`
	 * prop and the `headingValue` store to create a label like `Event Date, January 2021`.
	 */
	const fullCalendarLabel = derived(
		[headingValue, calendarLabel],
		([$headingValue, $calendarLabel]) => {
			return `${$calendarLabel}, ${$headingValue}`;
		}
	);

	/**
	 * The root element of the calendar, capable of housing multiple grids/months
	 * when using paged navigation.
	 */
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
			 * Generates the accessible calendar heading when the grid is mounted.
			 * The label is dynamically updated through an effect whenever there
			 * are changes in the active date or label.
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

	/**
	 * The calendar heading, visually displaying the current month and year. This heading
	 * is hidden from screen readers as an accessible heading is automatically generated
	 * for the calendar.
	 *
	 * To customize the accessible heading's prefix, use the `calendarLabel` prop. By default,
	 * the accessible heading reads as `Event Date, January 2021` for January 2021. If you set
	 * the `calendarLabel` prop to 'Booking Date', the accessible heading will be 'Booking Date,
	 * January 2021' for the same month and year.
	 */
	const heading = builder(name('heading'), {
		returned: () => {
			return {
				'aria-hidden': true,
			};
		},
	});

	/**
	 * A grid element that serves as a container for a single month in the calendar.
	 * Grids should be rendered for each month present in the `months` store returned
	 * by the `createCalendar` builder.
	 *
	 * For more details about the structure of the month object, refer to {@link Month}.
	 */
	const grid = builder(name('grid'), {
		returned: () => ({ tabindex: -1, id: ids.grid, role: 'grid' }),
	});

	/**
	 * The 'prev' button for the calendar, enabling navigation to the
	 * previous page. In paged navigation mode, it moves the calendar
	 * back by the number of months specified in the `numberOfMonths` prop.
	 * In non-paged mode, it shifts the calendar back by one month.
	 */
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

	/**
	 * A button element designed for navigating to the next page of the calendar.
	 * If using paged navigation, it advances the calendar by the number of months
	 * specified in the `numberOfMonths` prop. If not using paged navigation, it
	 * moves the calendar forward by one month.
	 */
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

	/**
	 * Represents an individual date cell in the calendar grid,
	 * signifying a single day within the month. Configured with
	 * essential attributes and event handlers for accessibility
	 * and interactivity.
	 */
	const cell = builder(name('cell'), {
		stores: [value, isDisabled, isUnavailable, isOutsideVisibleMonths, placeholder],
		returned: ([$value, $isDisabled, $isUnavailable, $isOutsideVisibleMonths, $placeholder]) => {
			/**
			 * Applies the appropriate attributes to each date cell in the calendar.
			 *
			 * @params cellValue - The `DateValue` for the current cell.
			 * @params monthValue - The `DateValue` for the current month, which is used
			 * to determine if the current cell is outside the current month.
			 */
			return (cellValue: T, monthValue: T) => {
				const cellDate = toDate(cellValue);
				const isDisabled = $isDisabled?.(cellValue);
				const isUnavailable = $isUnavailable?.(cellValue);
				const isDateToday = isToday(cellValue, getLocalTimeZone());
				const isOutsideMonth = !isSameMonth(cellValue, monthValue);
				const isOutsideVisibleMonths = $isOutsideVisibleMonths(cellValue);
				const isFocusedDate = isSameDay(cellValue, $placeholder);
				const isSelectedDate = $value ? isSameDay(cellValue, $value) && !isOutsideMonth : false;

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
					'data-value': cellValue.toString(),
					'data-disabled': isDisabled || isOutsideMonth ? '' : undefined,
					'data-unavailable': isUnavailable ? '' : undefined,
					'data-today': isDateToday ? '' : undefined,
					'data-outside-month': isOutsideMonth ? '' : undefined,
					'data-outside-visible-months': isOutsideVisibleMonths ? '' : undefined,
					'data-focused': isFocusedDate ? '' : undefined,
					tabindex: isFocusedDate ? 0 : isOutsideMonth || isDisabled ? undefined : -1,
					// We share some selection logic between this and the range calendar
					// so we use a common data attr that isn't a `melt` attr
					'data-calendar-cell': '',
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
					if (!args.value) return;
					handleCellClick(parseStringToDateValue(args.value, get(placeholder)));
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	/**
	 * Synchronize the locale used within the formatter to ensure
	 * dynamic updates are reflected in the calendar.
	 */
	effect([locale], ([$locale]) => {
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	/**
	 * Updates the displayed months based on changes in the placeholder value,
	 * which determines the months to show in the calendar.
	 */
	effect(
		[placeholder, weekStartsOn, locale, fixedWeeks, numberOfMonths],
		([$placeholder, $weekStartsOn, $locale, $fixedWeeks, $numberOfMonths]) => {
			if (!isBrowser || !$placeholder) return;

			const $visibleMonths = get(visibleMonths);

			/**
			 * If the placeholder's month is already in the visible months,
			 * we don't need to do anything.
			 */
			if ($visibleMonths.some((month) => isSameMonth(month, $placeholder))) {
				return;
			}

			const defaultMonthProps = {
				weekStartsOn: $weekStartsOn,
				locale: $locale,
				fixedWeeks: $fixedWeeks,
				numberOfMonths: $numberOfMonths,
			};

			months.set(
				createMonths({
					...defaultMonthProps,
					dateObj: $placeholder,
				})
			);
		}
	);

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

	/**
	 * Synchronizing the placeholder value with the current value.
	 */
	effect([value], ([$value]) => {
		if ($value && get(placeholder) !== $value) {
			placeholder.set($value);
		}
	});

	/**
	 * This derived store holds an array of localized day names for the current
	 * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
	 * updating its content when the option changes. Using this store to render the
	 * calendar's days of the week is strongly recommended, as it guarantees that
	 * the days are correctly formatted for the current locale and calendar view.
	 *
	 * @example
	 * ```svelte
	 * <table use:melt={$grid} class="w-full">
	 * 	<thead aria-hidden="true">
	 * 		<tr>
	 * 			{#each $daysOfWeek as day}
	 * 				<th class="text-sm font-semibold text-magnum-800">
	 * 					<div class="flex h-6 w-6 items-center justify-center p-4">
	 * 						{day}
	 * 					</div>
	 * 				</th>
	 * 			{/each}
	 * 		</tr>
	 * 	</thead>
	 * 	<!-- ... -->
	 * </table>
	 * ```
	 *
	 * If you prefer to format/render the days of the week yourself,
	 * you can do so by accessing the first week of the first month,
	 * and mapping over the dates to get/format each day of the week.
	 *
	 * @example
	 * ```svelte
	 * {#each $months as month}
	 * 	<table use:melt={$grid} class="w-full">
	 * 		<thead aria-hidden="true">
	 * 			<tr>
	 * 				{#each month.weeks[0] as dayOfWeek}
	 * 					<th class="text-sm font-semibold text-magnum-800">
	 * 						<div class="flex h-6 w-6 items-center justify-center p-4">
	 * 							{new Intl.DateTimeFormat('en', { weekday: 'long' }).format
	 * 							(dayOfWeek)}
	 * 						</div>
	 * 					</th>
	 * 				{/each}
	 * 			</tr>
	 * 		</thead>
	 * 		<!-- ... -->
	 * 	</table>
	 * {/each}
	 * ```
	 *
	 */
	const daysOfWeek = derived([months], ([$months]) => {
		if (!$months.length) return [];
		return $months[0].weeks[0].map((date) => {
			return formatter.dayOfWeek(toDate(date));
		});
	});

	/**
	 * Creates an accessible heading for the calendar, ensuring that
	 * when it is focused by a screen reader, the displayed date range
	 * is announced. This approach maintains accessibility for screen
	 * readers while keeping the heading hidden from the visual design
	 * of the calendar.
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
	 *
	 * @remarks
	 * If using paged navigation, this will move the calendar forward
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar forward
	 * by one month.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { nextPage } } = createCalendar()
	 * </script>
	 *
	 * <button on:click={nextPage} aria-label="Next page">▶️</button>
	 * ```
	 */
	function nextPage() {
		const $months = get(months);
		const $numberOfMonths = get(numberOfMonths);
		if (get(pagedNavigation)) {
			const firstMonth = $months[0].value;
			placeholder.set(firstMonth.add({ months: $numberOfMonths }));
		} else {
			const firstMonth = $months[0].value;
			const newMonths = createMonths({
				dateObj: firstMonth.add({ months: 1 }),
				weekStartsOn: get(weekStartsOn),
				locale: get(locale),
				fixedWeeks: get(fixedWeeks),
				numberOfMonths: $numberOfMonths,
			});

			months.set(newMonths);
			placeholder.set(newMonths[0].value.set({ day: 1 }));
		}
	}

	/**
	 * Navigate to the previous page of the calendar.
	 *
	 * @remarks
	 * A helper function to navigate to the previous page of the calendar.
	 * If using paged navigation, this will move the calendar backwards
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar backwards
	 * by one month.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { prevPage } } = createCalendar()
	 * </script>
	 *
	 * <button on:click={prevPage} aria-label="Previous page">◀️</button>
	 * ```
	 */
	function prevPage() {
		const $months = get(months);
		const $numberOfMonths = get(numberOfMonths);
		if (get(pagedNavigation)) {
			const firstMonth = $months[0].value;
			placeholder.set(firstMonth.subtract({ months: $numberOfMonths }));
		} else {
			const firstMonth = $months[0].value;
			const newMonths = createMonths({
				dateObj: firstMonth.subtract({ months: 1 }),
				weekStartsOn: get(weekStartsOn),
				locale: get(locale),
				fixedWeeks: get(fixedWeeks),
				numberOfMonths: $numberOfMonths,
			});

			months.set(newMonths);
			placeholder.set(newMonths[0].value.set({ day: 1 }));
		}
	}

	/**
	 * Navigate to the next year in the calendar.
	 *
	 * @remarks
	 * A helper function to navigate to the next year in the calendar,
	 * which is useful if you want to extend the calendar to have buttons
	 * to navigate to the next/prev year.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { nextYear, prevYear } } = createCalendar()
	 * </script>
	 *
	 * <button on:click={prevYear} aria-label="Previous year">◀️</button>
	 * <button on:click={nextYear} aria-label="Next year">▶️</button>
	 *
	 * ```
	 */
	function nextYear() {
		placeholder.add({ years: 1 });
	}

	/**
	 * A helper function to navigate to the previous year in the calendar,
	 * which is useful if you want to extend the calendar to have buttons
	 * to navigate to the next/prev year.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { nextYear, prevYear } } = createCalendar()
	 * </script>
	 *
	 * <button on:click={prevYear} aria-label="Previous year">◀️</button>
	 * <button on:click={nextYear} aria-label="Next year">▶️</button>
	 *
	 * ```
	 */
	function prevYear() {
		placeholder.subtract({ years: 1 });
	}

	const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT];

	/**
	 * Set the year of the calendar to the specified year.
	 *
	 * @remarks
	 * This is useful if you want to extend the calendar to have
	 * alternative ways to change the year, such as a select input.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { setYear } } = createCalendar()
	 *
	 * 	let selectValue = 2023;
	 * 	$: setYear(selectValue);
	 * </script>
	 *
	 * <select bind:value={selectValue} aria-label='Select a year'>
	 * 	<option value={2023}>2023</option>
	 * 	<option value={2024}>2024</option>
	 * 	<option value={2025}>2025</option>
	 * 	<!-- ... -->
	 * </select>
	 * ```
	 */
	function setYear(year: number) {
		placeholder.setDate({ year: year });
	}

	/**
	 * Set the month of the calendar to the specified month.
	 *
	 * @remarks
	 * This is useful if you want to extend the calendar to have
	 * alternative ways to change the month, such as a select input.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { setMonth } } = createCalendar()
	 *
	 * 	let selectValue = 1;
	 * 	$: setMonth(selectValue);
	 * </script>
	 *
	 * <select bind:value={selectValue} aria-label='Select a month'>
	 * 	<option value={1}>January</option>
	 * 	<option value={2}>February</option>
	 * 	<option value={3}>March</option>
	 * 	<!-- ... -->
	 * </select>
	 * ```
	 */
	function setMonth(month: number) {
		placeholder.setDate({ month: month });
	}

	function handleCellClick(date: DateValue) {
		value.update((prev) => {
			if (get(allowDeselect) && prev && isSameDay(prev, date)) {
				placeholder.set(date);
				announcer.announce('Selected date is now empty.', 'polite', 5000);
				return undefined;
			}
			announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, 'polite');
			return date;
		});
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

			handleCellClick(parseStringToDateValue(cellValue, get(placeholder)));
		}
	}

	function shiftFocus(node: HTMLElement, add: number) {
		const candidateCells = getSelectableCells(ids.calendar);
		if (!candidateCells.length) return;

		const index = candidateCells.indexOf(node);
		const nextIndex = index + add;

		/**
		 * If the next cell is within the bounds of the
		 * displayed/rendered cells, easy day, just focus it.
		 */
		if (isValidIndex(nextIndex, candidateCells)) {
			const nextCell = candidateCells[nextIndex];
			setPlaceholderToNodeValue(nextCell, placeholder);
			return nextCell.focus();
		}

		/**
		 * When the next cell falls outside the displayed/rendered cells range,
		 * we update the focus to the previous or next month based on the direction,
		 * and then focus on the relevant cell.
		 */

		if (nextIndex < 0) {
			/**
			 * To handle negative index values, we rewind by one month,
			 * retrieve candidate cells for that month, and shift the focus
			 * by the difference between the nextIndex starting from the end
			 * of the array.
			 */

			// shift the calendar back a month

			const $months = get(months);
			const firstMonth = $months[0].value;
			const $numberOfMonths = get(numberOfMonths);
			placeholder.set(firstMonth.subtract({ months: $numberOfMonths }));

			// Without a tick here, it seems to be too fast for
			// the DOM to update, with the tick it works great
			tick().then(() => {
				const newCandidateCells = getSelectableCells(ids.calendar);
				if (!newCandidateCells.length) {
					return;
				}

				/**
				 * Starting at the end of the array, shift focus by the
				 * difference between the nextIndex and the length of the
				 * array, since the nextIndex is negative.
				 */

				const newIndex = newCandidateCells.length - Math.abs(nextIndex);
				if (isValidIndex(newIndex, newCandidateCells)) {
					const newCell = newCandidateCells[newIndex];
					setPlaceholderToNodeValue(newCell, placeholder);
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

			const $months = get(months);
			const firstMonth = $months[0].value;
			const $numberOfMonths = get(numberOfMonths);
			placeholder.set(firstMonth.add({ months: $numberOfMonths }));

			tick().then(() => {
				const newCandidateCells = getSelectableCells(ids.calendar);
				if (!newCandidateCells.length) {
					return;
				}

				/**
				 * We need to determine how far into the next month we need to go
				 * to get the next index. So if we only went over the previous
				 * month by 1, we need to go into the next month by 1 to get the
				 * right index.
				 */
				const newIndex = nextIndex - candidateCells.length;

				if (isValidIndex(newIndex, newCandidateCells)) {
					const nextCell = newCandidateCells[newIndex];
					return nextCell.focus();
				}
			});
		}
	}

	/**
	 * A helper function to determine if a date is disabled,
	 * which uses the `Matcher`(s) provided via the `isDisabled`
	 * prop, as well as other internal logic, that determines
	 * if a date is disabled, such as if it's outside of the
	 * month, or if it's before/after the min/max values.
	 *
	 * Although we set attributes on the cells themselves, for
	 * easy styling this function is useful when you want to
	 * conditionally handle something outside of the cell,
	 * such as its wrapping element.
	 *
	 * @example
	 * ```svelte
	 * {#each dates as date}
	 * 	<td role="gridcell" aria-disabled={$isDisabled(date)}>
	 * 		<!-- ... -->
	 * 	</td>
	 * {/each}
	 * ```
	 *
	 * @param date - The `DateValue` to check
	 * @returns `true` if the date is disabled, `false` otherwise
	 */
	const isDateDisabled = derived(
		[isDisabled, placeholder, minValue, maxValue],
		([$isDisabled, $placeholder, $minValue, $maxValue]) => {
			return (date: DateValue) => {
				if ($isDisabled?.(date)) return true;
				if ($minValue && isBefore(date, $minValue)) return true;
				if ($maxValue && isAfter(date, $maxValue)) return true;
				if (!isSameMonth(date, $placeholder)) return true;
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
			placeholder: placeholder.toWritable(),
			months,
			value,
			daysOfWeek,
			headingValue,
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