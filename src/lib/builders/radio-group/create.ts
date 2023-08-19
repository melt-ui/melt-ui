import {
	addEventListener,
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	getDirectionalKeys,
	getElemDirection,
	isHTMLElement,
	kbd,
	omit,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { onMount } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import type { RadioGroupEvents } from './events.js';
import type { CreateRadioGroupProps, RadioGroupItemProps } from './types.js';

const defaults = {
	orientation: 'vertical',
	loop: true,
	disabled: false,
	required: false,
	defaultValue: undefined,
} satisfies Defaults<CreateRadioGroupProps>;

type RadioGroupParts = 'item' | 'item-input';
const { name, selector } = createElHelpers<RadioGroupParts>('radio-group');

export function createRadioGroup(props?: CreateRadioGroupProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateRadioGroupProps;

	// options
	const options = toWritableStores(omit(withDefaults, 'value'));
	const { disabled, required, loop, orientation } = options;

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

	/** Lifecycle & Effects */
	const focusedHistory: {
		prev: HTMLElement | null;
		curr: HTMLElement | null;
	} = {
		prev: null,
		curr: null,
	};

	onMount(() => {
		return addEventListener(document, 'focus', (e) => {
			const focusedItem = e.target as HTMLElement;
			if (!isHTMLElement(focusedItem)) return;
			focusedHistory.prev = focusedHistory.curr;
			focusedHistory.curr = focusedItem;
		});
	});

	let hasActiveTabIndex = false;
	effect(value, ($value) => {
		if ($value === undefined) {
			hasActiveTabIndex = false;
		} else {
			hasActiveTabIndex = true;
		}
	});

	/* Helpers */
	const selectItem = (item: HTMLElement) => {
		const disabled = item.dataset.disabled === 'true';
		const itemValue = item.dataset.value;
		if (disabled || itemValue === undefined) return;
		value.set(itemValue);
	};

	/** Elements */
	const root = builder(name(), {
		stores: [required, orientation],
		returned: ([$required, $orientation]) => {
			return {
				role: 'radiogroup',
				'aria-required': $required,
				'data-orientation': $orientation,
			} as const;
		},
	});

	const item = builder(name('item'), {
		stores: [value, orientation, disabled],
		returned: ([$value, $orientation, $disabled]) => {
			return (props: RadioGroupItemProps) => {
				const itemValue = typeof props === 'string' ? props : props.value;
				const argDisabled = typeof props === 'string' ? false : !!props.disabled;
				const disabled = $disabled || (argDisabled as boolean);

				const checked = $value === itemValue;

				const tabindex = !hasActiveTabIndex ? 0 : checked ? 0 : -1;
				hasActiveTabIndex = true;

				return {
					disabled,
					'data-value': itemValue,
					'data-orientation': $orientation,
					'data-disabled': disabled ? true : undefined,
					'data-state': checked ? 'checked' : 'unchecked',
					'aria-checked': checked,
					type: 'button',
					role: 'radio',
					tabindex,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<RadioGroupEvents['item']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					selectItem(node);
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					const el = e.currentTarget;
					if (!isHTMLElement(el)) return;

					const root = el.closest(selector());
					if (!isHTMLElement(root)) return;

					const items = Array.from(root.querySelectorAll(selector('item'))).filter(
						(el): el is HTMLElement => isHTMLElement(el)
					);
					const currentIndex = items.indexOf(el);

					const dir = getElemDirection(root);
					const { nextKey, prevKey } = getDirectionalKeys(dir, get(orientation));
					const $loop = get(loop);

					let itemToFocus: HTMLElement | null = null;
					if (e.key === nextKey) {
						e.preventDefault();
						const nextIndex = currentIndex + 1;
						if (nextIndex >= items.length && $loop) {
							itemToFocus = items[0];
						} else {
							itemToFocus = items[nextIndex];
						}
					} else if (e.key === prevKey) {
						e.preventDefault();
						const prevIndex = currentIndex - 1;
						if (prevIndex < 0 && $loop) {
							itemToFocus = items[items.length - 1];
						} else {
							itemToFocus = items[prevIndex];
						}
					} else if (e.key === kbd.HOME) {
						e.preventDefault();
						itemToFocus = items[0];
					} else if (e.key === kbd.END) {
						e.preventDefault();
						itemToFocus = items[items.length - 1];
					}

					if (itemToFocus) {
						itemToFocus.focus();
						selectItem(itemToFocus);
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const itemInput = builder(name('item-input'), {
		stores: [disabled, value],
		returned: ([$disabled, $value]) => {
			return (props: RadioGroupItemProps) => {
				const itemValue = typeof props === 'string' ? props : props.value;
				const argDisabled = typeof props === 'string' ? false : !!props.disabled;
				const disabled = $disabled || argDisabled;

				return {
					type: 'hidden',
					'aria-hidden': true,
					tabindex: -1,
					value: itemValue,
					checked: $value === itemValue,
					disabled,
				};
			};
		},
	});

	const isChecked = derived(value, ($value) => {
		return (itemValue: string) => {
			return $value === itemValue;
		};
	});

	return {
		elements: {
			root,
			item,
			itemInput,
		},
		states: {
			value,
		},
		helpers: {
			isChecked,
		},
		options,
	};
}
