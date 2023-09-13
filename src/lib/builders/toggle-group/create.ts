import {
	addMeltEventListener,
	builder,
	createElHelpers,
	disabledAttr,
	executeCallbacks,
	getElemDirection,
	handleRovingFocus,
	isHTMLElement,
	kbd,
	noop,
	omit,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived, get, writable } from 'svelte/store';
import type { ToggleGroupEvents } from './events.js';
import type { CreateToggleGroupProps, ToggleGroupItemProps, ToggleGroupType } from './types.js';

const defaults = {
	type: 'single',
	orientation: 'horizontal',
	loop: true,
	rovingFocus: true,
	disabled: false,
	defaultValue: '',
} satisfies Defaults<CreateToggleGroupProps>;

type ToggleGroupParts = 'item';
const { name, selector } = createElHelpers<ToggleGroupParts>('toggle-group');

export const createToggleGroup = <T extends ToggleGroupType = 'single'>(
	props?: CreateToggleGroupProps<T>
) => {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores(omit(withDefaults, 'value'));
	const { type, orientation, loop, rovingFocus, disabled } = options;

	const defaultValue = withDefaults.defaultValue
		? withDefaults.defaultValue
		: withDefaults.type === 'single'
		? 'undefined'
		: [];

	const valueWritable = withDefaults.value ?? writable(defaultValue);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

	const root = builder(name(), {
		stores: orientation,
		returned: ($orientation) => {
			return {
				role: 'group',
				'data-orientation': $orientation,
			} as const;
		},
	});

	const item = builder(name('item'), {
		stores: [value, disabled, orientation, type],
		returned: ([$value, $disabled, $orientation, $type]) => {
			return (props: ToggleGroupItemProps) => {
				const itemValue = typeof props === 'string' ? props : props.value;
				const argDisabled = typeof props === 'string' ? false : !!props.disabled;
				const disabled = $disabled || argDisabled;
				const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
				return {
					disabled: disabledAttr(disabled),
					pressed,
					'data-orientation': $orientation,
					'data-disabled': disabledAttr(disabled),
					'data-state': pressed ? 'on' : 'off',
					'data-value': itemValue,
					'aria-pressed': pressed,
					type: 'button',
					role: $type === 'single' ? 'radio' : undefined,
					tabindex: pressed ? 0 : -1,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<ToggleGroupEvents['item']> => {
			let unsub = noop;

			const parentGroup = node.closest(selector());
			if (!isHTMLElement(parentGroup)) return {};

			const items = Array.from(parentGroup.querySelectorAll(selector('item')));
			const $value = get(value);
			const anyPressed = Array.isArray($value) ? $value.length > 0 : $value !== null;

			if (!anyPressed && items[0] === node) {
				node.tabIndex = 0;
			}

			function getNodeProps() {
				const itemValue = node.dataset.value;
				const disabled = node.dataset.disabled === 'true';

				return { value: itemValue, disabled };
			}

			function handleValueUpdate() {
				const { value: itemValue, disabled } = getNodeProps();
				if (itemValue === undefined || disabled) return;

				value.update(($value) => {
					if (Array.isArray($value)) {
						if ($value.includes(itemValue)) {
							return $value.filter((i) => i !== itemValue);
						}
						$value.push(itemValue);
						return $value;
					}
					return $value === itemValue ? undefined : itemValue;
				});
			}

			unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					handleValueUpdate();
				}),

				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
						e.preventDefault();
						handleValueUpdate();
						return;
					}
					if (!get(rovingFocus)) return;

					const el = e.currentTarget;
					if (!isHTMLElement(el)) return;

					const root = el.closest(selector());
					if (!isHTMLElement(root)) return;

					const items = Array.from(
						root.querySelectorAll(selector('item') + ':not([data-disabled])')
					).filter((item): item is HTMLElement => isHTMLElement(item));

					const currentIndex = items.indexOf(el);

					const dir = getElemDirection(el);
					const $orientation = get(orientation);
					const nextKey = {
						horizontal: dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
						vertical: kbd.ARROW_DOWN,
					}[$orientation ?? 'horizontal'];

					const prevKey = {
						horizontal: dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
						vertical: kbd.ARROW_UP,
					}[$orientation ?? 'horizontal'];

					const $loop = get(loop);

					if (e.key === nextKey) {
						e.preventDefault();
						const nextIndex = currentIndex + 1;
						if (nextIndex >= items.length && $loop) {
							handleRovingFocus(items[0]);
						} else {
							handleRovingFocus(items[nextIndex]);
						}
					} else if (e.key === prevKey) {
						e.preventDefault();
						const prevIndex = currentIndex - 1;
						if (prevIndex < 0 && $loop) {
							handleRovingFocus(items[items.length - 1]);
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
		elements: {
			root,
			item,
		},
		states: {
			value,
		},
		helpers: {
			isPressed,
		},
		options,
	};
};
