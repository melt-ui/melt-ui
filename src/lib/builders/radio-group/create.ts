import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	getDirectionalKeys,
	isHTMLElement,
	isLeftClick,
	kbd,
} from '$lib/internal/helpers';
import { getElemDirection } from '$lib/internal/helpers/locale';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import type { CreateRadioGroupProps, RadioGroupItemProps } from './types';

const defaults = {
	orientation: 'vertical',
	loop: true,
	disabled: false,
	required: false,
} satisfies Defaults<CreateRadioGroupProps>;

type RadioGroupParts = 'item' | 'item-input';
const { name, selector } = createElHelpers<RadioGroupParts>('radio-group');

export function createRadioGroup(props: CreateRadioGroupProps = {}) {
	const withDefaults = { ...defaults, ...props };
	const options = writable({
		disabled: withDefaults.disabled,
		required: withDefaults.required,
		loop: withDefaults.loop,
		orientation: withDefaults.orientation,
	});
	const value = writable(withDefaults.value ?? null);

	const root = builder(name(), {
		stores: options,
		returned: ($options) => {
			return {
				role: 'radiogroup',
				'aria-required': $options.required,
				'data-orientation': $options.orientation,
			} as const;
		},
	});

	const item = builder(name('item'), {
		stores: [options, value],
		returned: ([$options, $value]) => {
			return (props: RadioGroupItemProps) => {
				const itemValue = typeof props === 'string' ? props : props.value;
				const argDisabled = typeof props === 'string' ? false : !!props.disabled;
				const disabled = $options.disabled || (argDisabled as boolean);

				const checked = $value === itemValue;

				return {
					disabled,
					'data-value': itemValue,
					'data-orientation': $options.orientation,
					'data-disabled': disabled ? true : undefined,
					'data-state': checked ? 'checked' : 'unchecked',
					'aria-checked': checked,
					type: 'button',
					role: 'radio',
					tabindex: $value === null ? 0 : checked ? 0 : -1,
				} as const;
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'pointerdown', (e) => {
					if (!isLeftClick(e)) {
						e.preventDefault();
						return;
					}

					const disabled = node.dataset.disabled === 'true';
					const itemValue = node.dataset.value;
					if (disabled || itemValue === undefined) return;
					value.set(itemValue);
				}),
				addEventListener(node, 'focus', () => {
					const disabled = node.dataset.disabled === 'true';
					const itemValue = node.dataset.value;
					if (disabled || itemValue === undefined) return;
					value.set(itemValue);
				}),
				addEventListener(node, 'keydown', (e) => {
					const $options = get(options);
					const el = e.currentTarget;
					if (!isHTMLElement(el)) return;

					const root = el.closest(selector());
					if (!isHTMLElement(root)) return;

					const items = Array.from(root.querySelectorAll(selector('item')));
					const currentIndex = items.indexOf(el);

					const dir = getElemDirection(root);
					const { nextKey, prevKey } = getDirectionalKeys(dir, $options.orientation);

					if (e.key === nextKey) {
						e.preventDefault();
						const nextIndex = currentIndex + 1;
						if (nextIndex >= items.length) {
							if ($options.loop) {
								const item = items[0];
								if (!isHTMLElement(item)) return;
								item.focus();
							}
						} else {
							const item = items[nextIndex];
							if (!isHTMLElement(item)) return;
							item.focus();
						}
					} else if (e.key === prevKey) {
						e.preventDefault();
						const prevIndex = currentIndex - 1;
						if (prevIndex < 0) {
							if ($options.loop) {
								const item = items[items.length - 1];
								if (!isHTMLElement(item)) return;
								item.focus();
							}
						} else {
							const item = items[prevIndex];
							if (!isHTMLElement(item)) return;
							item.focus();
						}
					} else if (e.key === kbd.HOME) {
						e.preventDefault();
						const item = items[0];
						if (!isHTMLElement(item)) return;
						item.focus();
					} else if (e.key === kbd.END) {
						e.preventDefault();
						const item = items[items.length - 1];
						if (!isHTMLElement(item)) return;
						item.focus();
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const itemInput = builder(name('item-input'), {
		stores: [options, value],
		returned: ([$options, $value]) => {
			return (props: RadioGroupItemProps) => {
				const itemValue = typeof props === 'string' ? props : props.value;
				const argDisabled = typeof props === 'string' ? false : !!props.disabled;
				const disabled = $options.disabled || argDisabled;

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
		options,
		value,
		isChecked,
		root,
		item,
		itemInput,
	};
}
