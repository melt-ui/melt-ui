import {
	builder,
	createElHelpers,
	executeCallbacks,
	getDirectionalKeys,
	isHTMLElement,
	kbd,
	omit,
	overridable,
	toWritableStores,
	getElemDirection,
	addMeltEventListener,
} from '$lib/internal/helpers';
import type { Defaults, MeltActionReturn } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import type { CreateRadioGroupProps, RadioGroupItemProps } from './types';

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

	type ItemEvents = 'click' | 'focus' | 'keydown';

	const item = builder(name('item'), {
		stores: [value, orientation, disabled],
		returned: ([$value, $orientation, $disabled]) => {
			return (props: RadioGroupItemProps) => {
				const itemValue = typeof props === 'string' ? props : props.value;
				const argDisabled = typeof props === 'string' ? false : !!props.disabled;
				const disabled = $disabled || (argDisabled as boolean);

				const checked = $value === itemValue;

				return {
					disabled,
					'data-value': itemValue,
					'data-orientation': $orientation,
					'data-disabled': disabled ? true : undefined,
					'data-state': checked ? 'checked' : 'unchecked',
					'aria-checked': checked,
					type: 'button',
					role: 'radio',
					tabindex: $value === null ? 0 : checked ? 0 : -1,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<ItemEvents> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					e.preventDefault();

					const disabled = node.dataset.disabled === 'true';
					const itemValue = node.dataset.value;
					if (disabled || itemValue === undefined) return;
					value.set(itemValue);
				}),
				addMeltEventListener(node, 'focus', () => {
					const disabled = node.dataset.disabled === 'true';
					const itemValue = node.dataset.value;
					if (disabled || itemValue === undefined) return;
					value.set(itemValue);
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

					if (e.key === nextKey) {
						e.preventDefault();
						const nextIndex = currentIndex + 1;
						if (nextIndex >= items.length && $loop) {
							items[0].focus();
						} else {
							items[nextIndex].focus();
						}
					} else if (e.key === prevKey) {
						e.preventDefault();
						const prevIndex = currentIndex - 1;
						if (prevIndex < 0 && $loop) {
							items[items.length - 1].focus();
						} else {
							items[prevIndex].focus();
						}
					} else if (e.key === kbd.HOME) {
						e.preventDefault();
						items[0].focus();
					} else if (e.key === kbd.END) {
						e.preventDefault();
						items[items.length - 1].focus();
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
