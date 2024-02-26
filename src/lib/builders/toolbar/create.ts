import {
	addMeltEventListener,
	makeElement,
	createElHelpers,
	disabledAttr,
	executeCallbacks,
	handleRovingFocus,
	isHTMLElement,
	kbd,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived, writable } from 'svelte/store';
import type { ToolbarEvents } from './events.js';
import type {
	CreateToolbarGroupProps,
	CreateToolbarProps,
	ToolbarGroupItemProps,
	ToolbarGroupType,
} from './types.js';

const defaults = {
	loop: true,
	orientation: 'horizontal',
} satisfies Defaults<CreateToolbarProps>;

const { name, selector } = createElHelpers('toolbar');

export const createToolbar = (props?: CreateToolbarProps) => {
	const withDefaults = { ...defaults, ...props } satisfies CreateToolbarProps;

	const options = toWritableStores(withDefaults);
	const { loop, orientation } = options;

	const root = makeElement(name(), {
		stores: orientation,
		returned: ($orientation) => {
			return {
				role: 'toolbar',
				'data-orientation': $orientation,
			};
		},
	});

	const button = makeElement(name('button'), {
		returned: () =>
			({
				role: 'button',
				type: 'button',
			} as const),
		action: (node: HTMLElement): MeltActionReturn<ToolbarEvents['button']> => {
			setNodeTabIndex(node);

			const unsub = addMeltEventListener(node, 'keydown', handleKeyDown);

			return {
				destroy: unsub,
			};
		},
	});

	const link = makeElement(name('link'), {
		returned: () =>
			({
				role: 'link',
			} as const),
		action: (node: HTMLElement): MeltActionReturn<ToolbarEvents['link']> => {
			setNodeTabIndex(node);

			const unsub = addMeltEventListener(node, 'keydown', handleKeyDown);

			return {
				destroy: unsub,
			};
		},
	});

	const separator = makeElement(name('separator'), {
		stores: orientation,
		returned: ($orientation) => {
			return {
				role: 'separator',
				'data-orientation': $orientation === 'horizontal' ? 'vertical' : 'horizontal',
				'aria-orientation': $orientation === 'horizontal' ? 'vertical' : 'horizontal',
			} as const;
		},
	});

	const groupDefaults = {
		type: 'single',
		disabled: false,
	} satisfies CreateToolbarGroupProps;

	const createToolbarGroup = <T extends ToolbarGroupType = 'single'>(
		props?: CreateToolbarGroupProps<T>
	) => {
		const groupWithDefaults = { ...groupDefaults, ...props };

		const options = toWritableStores(groupWithDefaults);
		const { type, disabled } = options;

		const defaultValue = groupWithDefaults.defaultValue
			? groupWithDefaults.defaultValue
			: groupWithDefaults.type === 'single'
			? undefined
			: [];

		const valueWritable =
			groupWithDefaults.value ?? writable<string | string[] | undefined>(defaultValue);
		const value = overridable(valueWritable, groupWithDefaults?.onValueChange);

		const { name } = createElHelpers('toolbar-group');

		const group = makeElement(name(), {
			stores: orientation,
			returned: ($orientation) => {
				return {
					role: 'group',
					'data-orientation': $orientation,
				} as const;
			},
		});

		const item = makeElement(name('item'), {
			stores: [disabled, type, value, orientation],
			returned: ([$disabled, $type, $value, $orientation]) => {
				return (props: ToolbarGroupItemProps) => {
					const itemValue = typeof props === 'string' ? props : props.value;
					const argDisabled = typeof props === 'string' ? false : !!props.disabled;
					const disabled = $disabled || argDisabled;

					const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;

					const isSingle = $type === 'single';
					const isMultiple = $type === 'multiple';
					return {
						disabled: disabledAttr(disabled),
						pressed,
						'data-orientation': $orientation,
						'data-disabled': disabledAttr(disabled),
						'data-value': itemValue,
						'data-state': pressed ? 'on' : 'off',
						'aria-checked': isSingle ? pressed : undefined,
						'aria-pressed': isMultiple ? pressed : undefined,
						type: 'button',
						role: isSingle ? 'radio' : undefined,
						'data-melt-toolbar-item': '',
					} as const;
				};
			},
			action: (node: HTMLElement): MeltActionReturn<ToolbarEvents['item']> => {
				setNodeTabIndex(node);

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

				const unsub = executeCallbacks(
					addMeltEventListener(node, 'click', () => {
						handleValueUpdate();
					}),
					addMeltEventListener(node, 'keydown', (e) => {
						if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
							e.preventDefault();
							handleValueUpdate();
							return;
						}
						handleKeyDown(e);
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
				group,
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

	function handleKeyDown(e: KeyboardEvent) {
		const $orientation = orientation.get();
		const $loop = loop.get();

		const dir = 'ltr' as 'ltr' | 'rtl';
		const nextKey = {
			horizontal: dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
			vertical: kbd.ARROW_DOWN,
		}[$orientation ?? 'horizontal'];

		const prevKey = {
			horizontal: dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
			vertical: kbd.ARROW_UP,
		}[$orientation ?? 'horizontal'];

		const el = e.currentTarget;
		if (!isHTMLElement(el)) return;
		const root = el.closest('[data-melt-toolbar]');
		if (!isHTMLElement(root)) return;

		const items = getToolbarItems(root);

		const currentIndex = items.indexOf(el);

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
	}

	return {
		elements: {
			root,
			button,
			separator,
			link,
		},
		builders: {
			createToolbarGroup,
		},
		options,
	};
};

/**
 * Sets the appropriate tabIndex for the node based on its position in the
 * parent toolbar.
 */
function setNodeTabIndex(node: HTMLElement) {
	const parentToolbar = node.closest('[data-melt-toolbar]');

	if (!isHTMLElement(parentToolbar)) return;

	const items = getToolbarItems(parentToolbar);

	if (items[0] === node) {
		node.tabIndex = 0;
	} else {
		node.tabIndex = -1;
	}
}

/**
 * Returns an array of all toolbar items within the given element.
 */
function getToolbarItems(element: HTMLElement) {
	return Array.from(
		element.querySelectorAll(`${selector('item')}, ${selector('button')}, ${selector('link')}`)
	).filter((el): el is HTMLElement => isHTMLElement(el));
}
