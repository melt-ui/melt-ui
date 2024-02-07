import {
	addEventListener,
	addMeltEventListener,
	createElHelpers,
	disabledAttr,
	effect,
	executeCallbacks,
	getDirectionalKeys,
	getElemDirection,
	isHTMLElement,
	kbd,
	makeElement,
	omit,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import { safeOnMount } from '$lib/internal/helpers/lifecycle.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived, writable } from 'svelte/store';
import { createHiddenInput } from '../hidden-input/create.js';
import type { RadioGroupEvents } from './events.js';
import type { CreateRadioGroupProps, RadioGroupItemProps } from './types.js';

const defaults = {
	orientation: 'vertical',
	loop: true,
	disabled: false,
	required: false,
	defaultValue: undefined,
} satisfies Defaults<CreateRadioGroupProps>;

type RadioGroupParts = 'item' | 'hidden-input';
const prefix = 'radio-group';
const { name, selector } = createElHelpers<RadioGroupParts>(prefix);

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

	safeOnMount(() => {
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
	const root = makeElement(name(), {
		stores: [required, orientation],
		returned: ([$required, $orientation]) => {
			return {
				role: 'radiogroup',
				'aria-required': $required,
				'data-orientation': $orientation,
			} as const;
		},
	});

	const item = makeElement(name('item'), {
		stores: [value, orientation, disabled],
		returned: ([$value, $orientation, $disabled]) => {
			return (props: RadioGroupItemProps) => {
				const itemValue = typeof props === 'string' ? props : props.value;
				const argDisabled = typeof props === 'string' ? false : !!props.disabled;
				const disabled = $disabled || argDisabled;

				const checked = $value === itemValue;

				const tabindex = !hasActiveTabIndex ? 0 : checked ? 0 : -1;
				hasActiveTabIndex = true;

				return {
					disabled,
					'data-value': itemValue,
					'data-orientation': $orientation,
					'data-disabled': disabledAttr(disabled),
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
						(el): el is HTMLElement => isHTMLElement(el) && !el.hasAttribute('data-disabled')
					);
					const currentIndex = items.indexOf(el);

					const dir = getElemDirection(root);
					const { nextKey, prevKey } = getDirectionalKeys(dir, orientation.get());
					const $loop = loop.get();

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

	const hiddenInput = createHiddenInput({
		value,
		disabled,
		required,
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
			hiddenInput,
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
