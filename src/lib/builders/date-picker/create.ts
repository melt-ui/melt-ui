import {
	SELECTION_KEYS,
	addEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	getNextFocusable,
	getPreviousFocusable,
	handleRovingFocus,
	isBrowser,
	isHTMLElement,
	kbd,
	noop,
	sleep,
	styleToString,
} from '$lib/internal/helpers';

import {
	isAfter,
	isBefore,
	isBetween,
	isSameDay,
	isToday,
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
import { derived, get, readable, writable } from 'svelte/store';
import type { CreateDatePickerProps, DateProps } from './types';

const defaults = {
	closeOnEscape: true,
	closeOnOutsideClick: true,
	disabled: false,
	earliest: null,
	latest: null,
	preventScroll: true,
	mode: 'single',
	value: [new Date()],
	autoSelect: true,
	open: false,
	arrowSize: 6,
	autoClose: false,
	positioning: {
		placement: 'bottom',
	},
	activeDate: new Date(),
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
	const options = writable({ ...defaults, ...props });
	const arrowSize = readable(get(options).arrowSize);
	const open = writable(get(options).open);
	const activeTrigger = writable<HTMLElement | null>(null);
	const value = writable<CreateDatePickerProps['value']>(get(options).value);
	const dates = writable<Date[]>([]);
	const lastMonthDates = writable<Date[]>([]);
	const nextMonthDates = writable<Date[]>([]);
	const selectEnd = writable<boolean>(false);
	const activeDate = writable<Date>(get(options).activeDate);

	if (get(options).type === 'range') {
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

	const nextMonth = builder(name('nextMonth'), {
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

	const prevMonth = builder(name('prevMonth'), {
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

	const nextYear = builder(name('nextYear'), {
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

	const prevYear = builder(name('prevYear'), {
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
			let unsubPopper = noop;

			const unsubDerived = effect([open, activeTrigger], ([$open, $activeTrigger]) => {
				unsubPopper();
				if ($open && $activeTrigger) {
					tick().then(() => {
						const popper = usePopper(node, {
							anchorElement: $activeTrigger,
							open,
							options: {},
						});

						if (popper && popper.destroy) {
							unsubPopper = popper.destroy;
						}
					});
				}
			});

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
					unsubDerived();
					unsubPopper();
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

	const date = builder(name('date'), {
		stores: [value, options],
		returned: ([$value, $options]) => {
			const { earliest, latest } = get(options);
			return (props: DateProps) => {
				// console.table({
				// 	date: new Date(args.value || ''),
				// 	value: $value,
				// 	type: get(options).type,
				// });
				const selected = getSelectedFromValue({
					date: new Date(props.value || ''),
					value: $value,
					type: get(options).type,
				});
				return {
					role: 'date',
					'aria-selected': selected ? true : undefined,
					'data-selected': selected ? true : undefined,
					'data-start':
						$options.type === 'range' && isSameDay(new Date(props.value), $value[0])
							? ''
							: undefined,
					'data-end':
						$options.type === 'range' && isSameDay(new Date(props.value), $value[1])
							? ''
							: undefined,
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
				switch (get(options).type) {
					case 'single':
						value.set([date]);
						if (get(options).autoClose) {
							open.set(false);
						}
						break;
					case 'range':
						value.update((prev) => {
							if (get(selectEnd)) {
								prev[0] = date;
							} else {
								prev[1] = date;
							}
							return prev;
						});
						selectEnd.set(!get(selectEnd));
						break;
					case 'multiple':
						value.update((prev) => {
							if (prev.some((d) => isSameDay(d, date))) {
								prev = prev.filter((d) => !isSameDay(d, date));
							} else {
								prev = [...prev, date];
							}

							console.log(prev);
							return prev;
						});
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
				if (get(options).autoClose) {
					open.set(false);
				}
			});

			return {
				destroy: unsub,
			};
		},
	});

	function focusElement(add: number) {
		let node = document.activeElement as HTMLElement;
		if (!node || node.hasAttribute('[data-melt-calendar-date]')) return;
		const allDates = Array.from(
			document.querySelectorAll<HTMLElement>(`[data-melt-calendar-date]:not([data-disabled])`)
		);
		let index = allDates.indexOf(node);
		let nextIndex = index + add;
		let nextDate = allDates[nextIndex];
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

			let lastSunday = getLastSunday(datesArray[0]);
			let nextSaturday = getNextSaturday(datesArray[datesArray.length - 1]);

			let lastMonthDays = getDaysBetween(lastSunday, datesArray[0]);
			let nextMonthDays = getDaysBetween(datesArray[datesArray.length - 1], nextSaturday);

			lastMonthDates.set(lastMonthDays);
			dates.set(datesArray);
			nextMonthDates.set(nextMonthDays);
		}
	});

	effect([options], ([$options]) => {
		if (!isBrowser) return;

		if ($options.type === 'range') {
			value.update((prev) => {
				if (prev.length < 2) {
					prev.push(prev[0]);
				}
				return prev;
			});
		}
	});

	return {
		trigger,
		open,
		content,
		arrow,
		close,
		value,
		nextMonth,
		prevMonth,
		activeDate,
		nextYear,
		prevYear,
		dates,
		date,
		lastMonthDates,
		nextMonthDates,
		confirm,
	};
}
