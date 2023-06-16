import { elementMultiDerived, kbd } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';

type Orientation = 'horizontal' | 'vertical';

export type CreateRadioGroupArgs = {
	disabled?: boolean;
	loop?: boolean;
	orientation?: Orientation;
	value?: string;
	required?: boolean;
};

const defaults = {
	orientation: 'vertical',
	loop: true,
	disabled: false,
	required: false,
} satisfies Defaults<CreateRadioGroupArgs>;

export function createRadioGroup(args: CreateRadioGroupArgs = {}) {
	const withDefaults = { ...defaults, ...args };
	const options = writable({
		disabled: withDefaults.disabled,
		required: withDefaults.required,
		loop: withDefaults.loop,
		orientation: withDefaults.orientation,
	});
	const value = writable(withDefaults.value ?? null);

	const root = derived(options, ($options) => {
		return {
			role: 'radiogroup',
			'aria-required': $options.required,
			'data-orientation': $options.orientation,
			'data-melt-part': 'radio-group',
		} as const;
	});

	type RadioGroupItemArgs =
		| {
				value: string;
				disabled?: boolean;
		  }
		| string;
	const item = elementMultiDerived([options, value], ([$options, $value], { attach }) => {
		return (args: RadioGroupItemArgs) => {
			const itemValue = typeof args === 'string' ? args : args.value;
			const argDisabled = typeof args === 'string' ? false : !!args.disabled;
			const disabled = $options.disabled || (argDisabled as boolean);

			attach('click', () => {
				if (disabled) return;
				value.set(itemValue);
			});

			attach('focus', (e) => {
				const el = e.currentTarget as HTMLElement;
				el.click();
			});

			// TODO: detect dir
			const dir = 'ltr' as 'ltr' | 'rtl';
			const nextKey = {
				horizontal: dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
				vertical: kbd.ARROW_DOWN,
			}[$options.orientation ?? 'horizontal'];

			const prevKey = {
				horizontal: dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
				vertical: kbd.ARROW_UP,
			}[$options.orientation ?? 'horizontal'];

			attach('keydown', (e) => {
				const el = e.currentTarget as HTMLElement;
				const root = el.closest('[data-melt-part="radio-group"]') as HTMLElement;

				const items = Array.from(
					root.querySelectorAll('[data-melt-part="radio-group-item"]')
				) as Array<HTMLElement>;
				const currentIndex = items.indexOf(el);

				if (e.key === nextKey) {
					e.preventDefault();
					const nextIndex = currentIndex + 1;
					if (nextIndex >= items.length) {
						if ($options.loop) {
							items[0].focus();
						}
					} else {
						items[nextIndex].focus();
					}
				} else if (e.key === prevKey) {
					e.preventDefault();
					const prevIndex = currentIndex - 1;
					if (prevIndex < 0) {
						if ($options.loop) {
							items[items.length - 1].focus();
						}
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
			});

			const checked = $value === itemValue;

			return {
				disabled,
				'data-orientation': $options.orientation,
				'data-disabled': disabled ? '' : undefined,
				'data-state': checked ? 'checked' : 'unchecked',
				'aria-checked': checked,
				type: 'button',
				role: 'radio',
				'data-melt-part': 'radio-group-item',
				tabindex: $value === null ? 0 : checked ? 0 : -1,
			} as const;
		};
	});

	const itemInput = derived([options, value], ([$options, $value]) => {
		return (args: RadioGroupItemArgs) => {
			const itemValue = typeof args === 'string' ? args : args.value;
			const argDisabled = typeof args === 'string' ? false : !!args.disabled;
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
	});

	const isChecked = derived(value, ($value) => {
		return (itemValue: string) => {
			return $value === itemValue;
		};
	});

	return {
		options,
		value,
		root,
		item,
		itemInput,
		isChecked,
	};
}
