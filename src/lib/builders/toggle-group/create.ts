import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	handleRovingFocus,
	isHTMLElement,
	kbd,
	noop,
	omit,
} from '$lib/internal/helpers';
import { getElemDirection } from '$lib/internal/helpers/locale';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import type { CreateToggleGroupProps, ToggleGroupItemProps } from './types';

const defaults = {
	type: 'single',
	orientation: 'horizontal',
	loop: true,
	rovingFocus: true,
	disabled: false,
	value: null,
} satisfies Defaults<CreateToggleGroupProps>;

type ToggleGroupParts = 'item';
const { name, selector } = createElHelpers<ToggleGroupParts>('toggle-group');

export function createToggleGroup(props: CreateToggleGroupProps = {}) {
	const withDefaults = { ...defaults, ...props };
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

	const root = builder(name(), {
		stores: options,
		returned: ($options) => {
			return {
				role: 'group',
				'data-orientation': $options.orientation,
			} as const;
		},
	});

	const item = builder(name('item'), {
		stores: [options, value],
		returned: ([$options, $value]) => {
			return (props: ToggleGroupItemProps) => {
				const itemValue = typeof props === 'string' ? props : props.value;
				const argDisabled = typeof props === 'string' ? false : !!props.disabled;
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
					role: $options.type === 'single' ? 'radio' : undefined,
					tabindex: pressed ? 0 : -1,
				} as const;
			};
		},
		action: (node: HTMLElement) => {
			let unsub = noop;

			const getNodeProps = () => {
				const itemValue = node.dataset.value;
				const disabled = node.dataset.disabled === 'true';

				return { value: itemValue, disabled };
			};

			const parentGroup = node.closest<HTMLElement>(selector());
			if (!isHTMLElement(parentGroup)) return;

			const items = Array.from(parentGroup.querySelectorAll<HTMLElement>(selector('item')));
			const $value = get(value);
			const anyPressed = Array.isArray($value) ? $value.length > 0 : $value !== null;

			if (!anyPressed && items[0] === node) {
				node.tabIndex = 0;
			}

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

					const root = el.closest<HTMLElement>(selector());
					if (!isHTMLElement(root)) return;

					const items = Array.from(
						root.querySelectorAll<HTMLElement>(selector('item') + ':not([data-disabled])')
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
								handleRovingFocus(items[0]);
							}
						} else {
							handleRovingFocus(items[nextIndex]);
						}
					} else if (e.key === prevKey) {
						e.preventDefault();
						const prevIndex = currentIndex - 1;
						if (prevIndex < 0) {
							if ($options.loop) {
								handleRovingFocus(items[items.length - 1]);
							}
						} else {
							handleRovingFocus(items[prevIndex]);
						}
					} else if (e.key === kbd.HOME) {
						e.preventDefault();
						handleRovingFocus(items[0]);
					} else if (e.key === kbd.END) {
						e.preventDefault();
						handleRovingFocus(items[items.length - 1]);
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
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
