import {
	addEventListener,
	executeCallbacks,
	isHTMLElement,
	kbd,
	noop,
	omit,
} from '$lib/internal/helpers';
import { getElemDirection } from '$lib/internal/helpers/locale';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';

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
	const options = writable(omit(withDefaults, 'value'));
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

	const root = {
		...derived(options, ($options) => {
			return {
				role: 'group',
				'data-orientation': $options.orientation,
				'data-melt-toggle-group': '',
			} as const;
		}),
		action: (node: HTMLElement) => {
			const $value = get(value);
			const anyPressed = Array.isArray($value) ? $value.length > 0 : $value !== null;
			const items = node.querySelectorAll<HTMLElement>('[data-melt-toggle-group-item]');
			items.forEach((item, idx) => {
				if (!anyPressed) {
					if (idx === 0) {
						item.tabIndex = 0;
						return;
					} else {
						item.tabIndex = -1;
						return;
					}
				}
				const itemValue = item.dataset.value;
				const pressed =
					Array.isArray($value) && itemValue ? $value.includes(itemValue) : $value === itemValue;
				item.tabIndex = pressed ? 0 : -1;
			});
		},
	};

	type ToggleGroupItemArgs =
		| {
				value: string;
				disabled?: boolean;
		  }
		| string;
	const item = {
		...derived([options, value], ([$options, $value]) => {
			return (args: ToggleGroupItemArgs) => {
				const itemValue = typeof args === 'string' ? args : args.value;
				const argDisabled = typeof args === 'string' ? false : !!args.disabled;
				const disabled = $options.disabled || argDisabled;
				const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
				return {
					disabled,
					pressed,
					'data-orientation': $options.orientation,
					'data-disabled': disabled ? true : undefined,
					'data-state': pressed ? 'on' : 'off',
					'data-value': itemValue,
					'aria-pressed': pressed,
					type: 'button',
					'data-melt-toggle-group-item': '',
					role: $options.type === 'single' ? 'radio' : undefined,
					tabindex: pressed ? 0 : -1,
				} as const;
			};
		}),
		action: (node: HTMLElement) => {
			let unsub = noop;

			const getNodeProps = () => {
				const itemValue = node.dataset.value;
				const disabled = node.dataset.disabled === 'true';

				return { value: itemValue, disabled };
			};

			unsub = executeCallbacks(
				addEventListener(node, 'click', () => {
					const { value: itemValue, disabled } = getNodeProps();
					if (itemValue === undefined || disabled) return;

					value.update((v) => {
						if (Array.isArray(v)) {
							return v.includes(itemValue) ? v.filter((i) => i !== itemValue) : [...v, itemValue];
						}
						return v === itemValue ? null : itemValue;
					});
				}),

				addEventListener(node, 'keydown', (e) => {
					const $options = get(options);
					if (!$options.rovingFocus) return;

					const el = e.currentTarget;
					if (!isHTMLElement(el)) return;

					const root = el.closest<HTMLElement>('[data-melt-toggle-group]');
					if (!isHTMLElement(root)) return;

					const items = Array.from(
						root.querySelectorAll<HTMLElement>('[data-melt-toggle-group-item]:not([data-disabled])')
					);

					const currentIndex = items.indexOf(el);

					const dir = getElemDirection(el);
					const nextKey = {
						horizontal: dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
						vertical: kbd.ARROW_DOWN,
					}[$options.orientation ?? 'horizontal'];

					const prevKey = {
						horizontal: dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
						vertical: kbd.ARROW_UP,
					}[$options.orientation ?? 'horizontal'];

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
				})
			);

			return {
				destroy: unsub,
			};
		},
	};

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
