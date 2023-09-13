import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	isHTMLElement,
	kbd,
	noop,
	overridable,
	sleep,
	styleToString,
	toWritableStores,
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
	getSelectedFromValue,
} from './utils';

import { usePopper } from '$lib/internal/actions';
import { onMount, tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import type { CreateDatePickerProps, DateProps } from './types';
import { omit } from '../../internal/helpers/object';

const defaults = {
	closeOnEscape: true,
	closeOnOutsideClick: true,
	disabled: false,
	earliest: null,
	latest: null,
	preventScroll: true,
	mode: 'single',
	value: undefined,
	autoSelect: true,
	open: false,
	arrowSize: 6,
	autoClose: false,
	positioning: {
		placement: 'bottom',
	},
	activeDate: new Date(),
	allowDeselect: false,
} satisfies CreateDatePickerProps;

type CalendarParts =
	| 'trigger'
	| 'content'
	| 'nextMonth'
	| 'prevMonth'
	| 'nextYear'
	| 'prevYear'
	| 'dateGrid'
	| 'close'
	| 'confirm'
	| 'date';
const { name } = createElHelpers<CalendarParts>('calendar');

export function createDatePicker(props?: CreateDatePickerProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDatePickerProps;

	const options = toWritableStores({
		...omit(withDefaults, 'value'),
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue ?? [new Date()]);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

	const {
		arrowSize,
		open,
		activeDate,
		mode,
		autoClose,
		autoSelect,
		allowDeselect,
		earliest,
		latest,
	} = options;

	const activeTrigger = writable<HTMLElement | null>(null);
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
			const unsub = addEventListener(node, 'click', () => {
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
			const unsub = addEventListener(node, 'click', () => {
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
			const unsub = addEventListener(node, 'click', () => {
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
			const unsub = addEventListener(node, 'click', () => {
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
		stores: open,
		returned: ($open) => {
			return {
				hidden: $open ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.content,
			};
		},
		action: (node: HTMLElement) => {
			/**
			 * I don't think we should force this to be a popper.
			 * It can be added to a popover, dialog, whatever with minimal effort
			 * and same functionality.
			 */

			// let unsubPopper = noop;

			// const unsubDerived = effect([open, activeTrigger], ([$open, $activeTrigger]) => {
			// 	unsubPopper();
			// 	if ($open && $activeTrigger) {
			// 		tick().then(() => {
			// 			const popper = usePopper(node, {
			// 				anchorElement: $activeTrigger,
			// 				open,
			// 				options: {
			// 					floating: {
			// 						placement: 'bottom',
			// 					},
			// 				},
			// 			});

			// 			if (popper && popper.destroy) {
			// 				unsubPopper = popper.destroy;
			// 			}
			// 		});
			// 	}
			// });

			const unsubKb = addEventListener(node, 'keydown', (e) => {
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

	const trigger = builder(name('trigger'), {
		stores: open,
		returned: ($open) => {
			return {
				role: 'button',
				'aria-haspopup': 'dialog',
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
				'aria-controls': ids.content,
			} as const;
		},
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				open.update((prev) => {
					const isOpen = !prev;
					if (isOpen) {
						activeTrigger.set(node);
					} else {
						activeTrigger.set(null);
					}
					return isOpen;
				});
			});

			return {
				destroy: unsub,
			};
		},
	});

	const arrow = derived(arrowSize, ($arrowSize) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$arrowSize}px)`,
			height: `var(--arrow-size, ${$arrowSize}px)`,
		}),
	}));

	const close = builder(name('close'), {
		returned: () =>
			({
				type: 'button',
			} as const),
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				open.set(false);
			});

			return {
				destroy: unsub,
			};
		},
	});

	function handleRangeClick(date: Date) {
		value.update((prev) => {
			if (prev[0] === prev[1] && prev[0] === date) {
				return prev;
			}

			if (prev.length) {
				if (prev.length > 1 || isBefore(date, prev[0])) {
					return [date];
				}
			}

			prev.push(date);
			return prev;
		});
	}

	function handleSingleClick(date: Date) {
		if (get(allowDeselect)) {
			value.update((prev) => (prev.length ? [] : [date]));
		} else {
			value.set([date]);
		}
		if (get(autoClose)) {
			open.set(false);
		}
	}

	function handleMultipleClick(date: Date) {
		value.update((prev) => {
			if (prev.some((d) => isSameDay(d, date))) {
				prev = prev.filter((d) => !isSameDay(d, date));
			} else {
				prev = [...prev, date];
			}

			return prev;
		});
	}

	const date = builder(name('date'), {
		stores: [value, earliest, latest, mode],
		returned: ([$value, $earliest, $latest, $mode]) => {
			return (props: DateProps) => {
				const selected = getSelectedFromValue({
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
			const unsub = addEventListener(node, 'click', () => {
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

	const confirm = builder(name('confirm'), {
		stores: activeDate,
		returned: ($activeDate) => {
			return {
				type: 'button',
				'data-confirm': true,
				'data-value': $activeDate,
			} as const;
		},
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				// value.set(get(activeDate) || get(value));
				if (autoClose) {
					open.set(false);
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

	effect([open, activeTrigger, activeDate], ([$open, $activeTrigger, $activeDate]) => {
		if (!isBrowser) return;

		if (!$open && $activeTrigger && isBrowser) {
			// Prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}

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
			trigger,
			content,
			arrow,
			close,
			nextMonthButton,
			prevMonthButton,
			nextYearButton,
			prevYearButton,
			date,
			confirm,
		},
		states: {
			open,
			activeDate,
			dates,
			lastMonthDates,
			nextMonthDates,
			value,
		},
		options: {},
	};
}
