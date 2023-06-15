import { elementMultiDerived, kbd } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';

type Orientation = 'horizontal' | 'vertical';

type SingleToggleGroupRootArgs = {
	type?: 'single';
	value?: string | null;
};

type MultipleToggleGroupRootProps = {
	type: 'multiple';
	value?: string[];
};

export type CreateToggleGroupArgs = (SingleToggleGroupRootArgs | MultipleToggleGroupRootProps) & {
	disabled?: boolean;
	rovingFocus?: boolean;
	loop?: boolean;
	orientation?: Orientation;
};

const defaults = {
	type: 'single',
	orientation: 'horizontal',
	loop: true,
	rovingFocus: true,
	disabled: false,
	value: null,
} satisfies Defaults<CreateToggleGroupArgs>;

export function createToggleGroup(args: CreateToggleGroupArgs = {}) {
	const withDefaults = { ...defaults, ...args };
	const options = writable({
		disabled: withDefaults.disabled,
		rovingFocus: withDefaults.rovingFocus,
		loop: withDefaults.loop,
		orientation: withDefaults.orientation,
		type: withDefaults.type,
	});
	const value = writable(withDefaults.value);

	options.subscribe((o) => {
		value.update((v) => {
			if (o.type === 'single' && Array.isArray(v)) {
				return null;
			}

			if (o.type === 'multiple' && !Array.isArray(v)) {
				return v === null ? [] : [v];
			}

			return v;
		});
	});

	const root = derived(options, ($options) => {
		return {
			role: 'group',
			'data-orientation': $options.orientation,
			'data-melt-part': 'toggle-group',
		} as const;
	});

	type ToggleGroupItemArgs =
		| {
				value: string;
				disabled?: boolean;
		  }
		| string;
	const item = elementMultiDerived([options, value], ([$options, $value], { attach }) => {
		return (args: ToggleGroupItemArgs) => {
			const itemValue = typeof args === 'string' ? args : args.value;
			const argDisabled = typeof args === 'string' ? false : !!args.disabled;
			const disabled = $options.disabled || argDisabled;

			attach('click', () => {
				if (disabled) return;
				value.update((v) => {
					if (Array.isArray(v)) {
						return v.includes(itemValue) ? v.filter((i) => i !== itemValue) : [...v, itemValue];
					}
					return v === itemValue ? null : itemValue;
				});
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
				if (!$options.rovingFocus) return;

				const el = e.currentTarget as HTMLElement;
				const root = el.closest('[data-melt-part="toggle-group"]') as HTMLElement;

				const items = Array.from(
					root.querySelectorAll('[data-melt-part="toggle-group-item"]')
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

			const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
			const anyPressed = Array.isArray($value) ? $value.length > 0 : $value !== null;
			return {
				disabled,
				pressed,
				'data-orientation': $options.orientation,
				'data-disabled': disabled ? '' : undefined,
				'data-state': pressed ? 'on' : 'off',
				'aria-pressed': pressed,
				type: 'button',
				'data-melt-part': 'toggle-group-item',
				tabIndex: anyPressed ? (pressed ? 0 : -1) : 0,
			} as const;
		};
	});

	const isPressed = derived(value, ($value) => {
		return (itemValue: string) => {
			return Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
		};
	});

	return {
		options,
		value,
		root,
		item,
		isPressed,
	};
}
