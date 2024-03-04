import {
	addMeltEventListener,
	createElHelpers,
	disabledAttr,
	executeCallbacks,
	getElemDirection,
	handleRovingFocus,
	isHTMLElement,
	kbd,
	makeElement,
	noop,
} from '$lib/internal/helpers/index.js';
import { parseProps } from '$lib/internal/helpers/props.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived } from 'svelte/store';
import type { ToggleGroupEvents } from './events.js';
import type { CreateToggleGroupProps, ToggleGroupItemProps } from './types.js';

const defaults = {
	type: 'single',
	orientation: 'horizontal',
	loop: true,
	rovingFocus: true,
	disabled: false,
	value: [],
} satisfies Defaults<CreateToggleGroupProps>;

type ToggleGroupParts = 'item';
const { name, selector } = createElHelpers<ToggleGroupParts>('toggle-group');

export function createToggleGroup(props?: CreateToggleGroupProps) {
	const { value, ...options } = parseProps({ props, defaults });
	const { type, orientation, loop, rovingFocus, disabled } = options;

	const root = makeElement(name(), {
		stores: orientation,
		returned: ($orientation) => {
			return {
				role: 'group',
				'data-orientation': $orientation,
			} as const;
		},
	});

	const item = makeElement(name('item'), {
		stores: [value, disabled, orientation, type],
		returned: ([$value, $disabled, $orientation, $type]) => {
			return (props: ToggleGroupItemProps) => {
				const itemValue = typeof props === 'string' ? props : props.value;
				const argDisabled = typeof props === 'string' ? false : !!props.disabled;
				const disabled = $disabled || argDisabled;
				const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
				const isSingle = $type === 'single';
				const isMultiple = $type === 'multiple' || $type === undefined;
				return {
					disabled: disabledAttr(disabled),
					pressed,
					'data-orientation': $orientation,
					'data-disabled': disabledAttr(disabled),
					'data-state': pressed ? 'on' : 'off',
					'data-value': itemValue,
					'aria-pressed': isMultiple ? pressed : undefined,
					'aria-checked': isSingle ? pressed : undefined,
					type: 'button',
					role: isSingle ? 'radio' : undefined,
					tabindex: pressed ? 0 : -1,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<ToggleGroupEvents['item']> => {
			let unsub = noop;

			const parentGroup = node.closest(selector());
			if (!isHTMLElement(parentGroup)) return {};

			const items = Array.from(parentGroup.querySelectorAll(selector('item')));
			const $value = value.get();
			const anyPressed = Array.isArray($value) ? $value.length > 0 : $value ? true : false;

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
					if ($value.includes(itemValue)) {
						return $value.filter((i) => i !== itemValue);
					}
					return [...$value, itemValue];
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
					if (!rovingFocus.get()) return;

					const el = e.currentTarget;
					if (!isHTMLElement(el)) return;

					const root = el.closest(selector());
					if (!isHTMLElement(root)) return;

					const items = Array.from(
						root.querySelectorAll(selector('item') + ':not([data-disabled])')
					).filter((item): item is HTMLElement => isHTMLElement(item));

					const currentIndex = items.indexOf(el);

					const dir = getElemDirection(el);
					const $orientation = orientation.get();
					const nextKey = {
						horizontal: dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
						vertical: kbd.ARROW_DOWN,
					}[$orientation ?? 'horizontal'];

					const prevKey = {
						horizontal: dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
						vertical: kbd.ARROW_UP,
					}[$orientation ?? 'horizontal'];

					const $loop = loop.get();

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

	return {
		elements: {
			root,
			item,
		},
		states: {
			value,
		},
		options,
	};
}
