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
} from '$lib/internal/helpers';

import {
	isBefore,
	isSameDay,
	nextMonth as getNextMonth,
	nextYear as getNextYear,
	prevMonth as getPrevMonth,
	prevYear as getPrevYear,
	getLastSunday,
	getNextSaturday,
	getDaysBetween,
	isSelected,
} from './utils';

import { onMount } from 'svelte';
import { get, writable } from 'svelte/store';
import type { CreateDatePickerProps, DateProps } from './types';

const defaults = {
	disabled: false,
	earliest: null,
	latest: null,
	mode: 'single',
	value: undefined,
	autoSelect: true,
	activeDate: new Date(),
	allowDeselect: false,
} satisfies CreateDatePickerProps;

// selectionStrategy - name for range behavior

type CalendarParts =
	| 'content'
	| 'nextMonth'
	| 'prevMonth'
	| 'nextYear'
	| 'prevYear'
	| 'dateGrid'
	| 'date';
const { name } = createElHelpers<CalendarParts>('calendar');

export function createDatePicker(props?: CreateDatePickerProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDatePickerProps;

	const options = toWritableStores({
		...omit(withDefaults, 'value'),
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue ?? [new Date()]);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

	const { activeDate, mode, allowDeselect } = options;

	let lastClickedDate: Date | null = null;

	const dates = writable<Date[]>([]);
	const lastMonthDates = writable<Date[]>([]);
	const nextMonthDates = writable<Date[]>([]);

	if (get(mode) === 'range') {
		value.update((prev) => {
			if (prev.length < 2) {
				prev.push(prev[0]);
			}
			return prev;
		});
	}

	const ids = {
		content: generateId(),
		input: generateId(),
	};

	const nextMonthButton = builder(name('nextMonth'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', () => {
				activeDate.update((prev) => {
					return getNextMonth(prev ?? new Date());
				});
			});

			return {
				destroy() {
					unsub();
				},
			};
		},
		stores: [activeDate],
		returned: (dates) => {
			return {};
		},
	});

	const prevMonthButton = builder(name('prevMonth'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', () => {
				activeDate.update((prev) => {
					return getPrevMonth(prev ?? new Date());
				});
			});

			return {
				destroy() {
					unsub();
				},
			};
		},
		stores: [dates, activeDate],
		returned: (dates) => {
			return {};
		},
	});

	const nextYearButton = builder(name('nextYear'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', () => {
				activeDate.update((prev) => {
					return getNextYear(prev ?? new Date());
				});
			});

			return {
				destroy() {
					unsub();
				},
			};
		},
		stores: [dates, activeDate],
		returned: (dates) => {
			return {};
		},
	});

	const prevYearButton = builder(name('prevYear'), {
		action: (node: HTMLElement) => {
			const unsub = addMeltEventListener(node, 'click', () => {
				activeDate.update((prev) => {
					return getPrevYear(prev ?? new Date());
				});
			});

			return {
				destroy() {
					unsub();
				},
			};
		},
		stores: [activeDate],
		returned: (dates) => {
			return {};
		},
	});

	const content = builder(name('content'), {
		stores: [],
		returned: () => {
			return {
				tabindex: -1,
				id: ids.content,
			};
		},
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
			// If the value array of dates is empty
			if (!prev.length) {
				prev.push(date, date);
				return prev;
			}

			// If the value array of dates has one date and the
			// new date is the same as the existing date
			if (prev[0] === prev[1] && prev[0] === date) {
				return prev;
			}

			if (isBefore(date, prev[0])) {
				if (prev[0] === prev[1]) {
					prev.splice(0, 2);
					prev.push(date, date);
					return prev;
				}

				return [date, date];
			}
			prev.pop();
			prev.push(date);
			return prev;
		});
	}

	function handleSingleClick(date: Date) {
		if (get(allowDeselect)) {
			value.update((prev) => {
				if (prev.length && isSameDay(prev[0], date)) {
					return [];
				}
				return [date];
			});
		} else {
			value.set([date]);
		}
	}

	function handleMultipleClick(date: Date) {
		value.update((prev) => {
			if (prev.some((d) => isSameDay(d, date))) {
				prev = prev.filter((d) => !isSameDay(d, date));
			} else {
				prev.push(date);
			}

			return prev;
		});
	}

	const date = builder(name('date'), {
		stores: [value, mode],
		returned: ([$value, $mode]) => {
			return (props: DateProps) => {
				const selected = isSelected({
					date: new Date(props.value || ''),
					value: $value,
					mode: $mode,
				});
				return {
					role: 'date',
					'aria-selected': selected ? true : undefined,
					'data-selected': selected ? true : undefined,
					'data-value': props.value,
					'data-label': props.label ?? undefined,
					'data-disabled': props.disabled ? '' : undefined,
					tabindex: props.disabled ? -1 : 1,
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

				if (lastClickedDate && isSameDay(lastClickedDate, date)) {
					value.set([date, date]);
				}
				lastClickedDate = date;

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
					default:
						value.set([new Date(args.value || '')]);
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

	onMount(() => {
		// TODO: add keyboard navigation
	});

	effect([activeDate], ([$activeDate]) => {
		if (!isBrowser) return;
		console.log('activeDate: ', $activeDate);

		if ($activeDate) {
			const daysInMonth = new Date(
				$activeDate.getFullYear(),
				$activeDate.getMonth() + 1,
				0
			).getDate();

			const datesArray = Array(daysInMonth)
				.fill(0)
				.map((_, i) => new Date($activeDate.getFullYear(), $activeDate.getMonth(), i + 1));

			const lastSunday = getLastSunday(datesArray[0]);
			const nextSaturday = getNextSaturday(datesArray[datesArray.length - 1]);

			const lastMonthDays = getDaysBetween(lastSunday, datesArray[0]);
			const nextMonthDays = getDaysBetween(datesArray[datesArray.length - 1], nextSaturday);

			lastMonthDates.set(lastMonthDays);
			dates.set(datesArray);
			nextMonthDates.set(nextMonthDays);
		}
	});

	effect([value], ([$value]) => {
		console.log('value: ', $value);
	});

	effect([mode], ([$mode]) => {
		if (!isBrowser) return;

		if ($mode === 'range') {
			value.update((prev) => {
				if (prev.length < 2) {
					prev.push(prev[0]);
				}
				return prev;
			});
		}
	});

	return {
		elements: {
			content,
			nextMonthButton,
			prevMonthButton,
			nextYearButton,
			prevYearButton,
			date,
		},
		states: {
			activeDate,
			dates,
			lastMonthDates,
			nextMonthDates,
			value,
		},
		options,
	};
}
