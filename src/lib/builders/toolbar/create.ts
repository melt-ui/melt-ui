import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	handleRovingFocus,
	isHTMLElement,
	kbd,
	omit,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable, type Readable } from 'svelte/store';
import type { CreateToolbarProps, CreateToolbarGroupProps, ToolbarGroupItemProps } from './types';

const defaults = {
	loop: true,
	orientation: 'horizontal',
} satisfies Defaults<CreateToolbarProps>;

const { name, selector } = createElHelpers('toolbar');

export function createToolbar(props: CreateToolbarProps = {}) {
	const withDefaults = { ...defaults, ...props };
	const toolbarOptions = writable({ ...withDefaults });

	const root = builder(name(), {
		stores: toolbarOptions,
		returned: ($toolbarOptions) => {
			return {
				role: 'toolbar',
				'data-orientation': $toolbarOptions.orientation,
			};
		},
	});

	const button = builder(name('button'), {
		returned: () =>
			({
				role: 'button',
				type: 'button',
				tabIndex: -1,
			} as const),
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'keydown', getKeydownHandler(toolbarOptions));

			return {
				destroy: unsub,
			};
		},
	});

	const link = builder(name('link'), {
		returned: () =>
			({
				role: 'link',
				'data-melt-toolbar-item': '',
				tabIndex: -1,
			} as const),
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'keydown', getKeydownHandler(toolbarOptions));

			return {
				destroy: unsub,
			};
		},
	});

	const separator = builder(name('separator'), {
		stores: toolbarOptions,
		returned: ($toolbarOptions) => {
			return {
				role: 'separator',
				'data-orientation':
					$toolbarOptions.orientation === 'horizontal' ? 'vertical' : 'horizontal',
				'aria-orientation':
					$toolbarOptions.orientation === 'horizontal' ? 'vertical' : 'horizontal',
			} as const;
		},
	});

	const groupDefaults = {
		type: 'single',
		disabled: false,
		value: null,
	} satisfies CreateToolbarGroupProps;

	function createToolbarGroup(props: CreateToolbarGroupProps = {}) {
		const groupWithDefaults = { ...groupDefaults, ...props };
		const groupOptions = writable(omit(groupWithDefaults, 'value'));

		const value = writable(groupWithDefaults.value);

		groupOptions.subscribe((o) => {
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

		const { name } = createElHelpers('toolbar-group');

		const root = builder(name(), {
			stores: toolbarOptions,
			returned: ($toolbarOptions) => {
				return {
					role: 'group',
					'data-orientation': $toolbarOptions.orientation,
				} as const;
			},
		});

		const item = builder(name('item'), {
			stores: [groupOptions, value, toolbarOptions],
			returned: ([$groupOptions, $value, $toolbarOptions]) => {
				return (props: ToolbarGroupItemProps) => {
					const itemValue = typeof props === 'string' ? props : props.value;
					const argDisabled = typeof props === 'string' ? false : !!props.disabled;
					const disabled = $groupOptions.disabled || argDisabled;

					const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;

					return {
						disabled,
						pressed,
						'data-orientation': $toolbarOptions.orientation,
						'data-disabled': disabled ? true : undefined,
						'data-value': itemValue,
						'data-state': pressed ? 'on' : 'off',
						'aria-pressed': pressed,
						type: 'button',
						role: $groupOptions.type === 'single' ? 'radio' : undefined,
						'data-melt-toolbar-item': '',
					} as const;
				};
			},
			action: (node: HTMLElement) => {
				const getNodeProps = () => {
					const itemValue = node.dataset.value;
					const disabled = node.dataset.disabled === 'true';

					return { value: itemValue, disabled };
				};

				const parentToolbar = node.closest<HTMLElement>('[data-melt-toolbar]');
				if (!parentToolbar) return;

				const items = getToolbarItems(parentToolbar);

				if (items[0] === node) {
					node.tabIndex = 0;
				} else {
					node.tabIndex = -1;
				}

				const unsub = executeCallbacks(
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

					addEventListener(node, 'keydown', getKeydownHandler(toolbarOptions))
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
			options: groupOptions,
			value,
			root,
			item,
			isPressed,
		};
	}

	return {
		root,
		options: toolbarOptions,
		button,
		link,
		separator,
		createToolbarGroup,
	};
}

function getToolbarItems(element: HTMLElement) {
	return Array.from(
		element.querySelectorAll<HTMLElement>(`${selector('item')}, ${selector('button')}`)
	);
}

const getKeydownHandler =
	(options: Readable<Pick<CreateToolbarProps, 'orientation' | 'loop'>>) => (e: KeyboardEvent) => {
		const $options = get(options);

		const dir = 'ltr' as 'ltr' | 'rtl';
		const nextKey = {
			horizontal: dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
			vertical: kbd.ARROW_DOWN,
		}[$options.orientation ?? 'horizontal'];

		const prevKey = {
			horizontal: dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
			vertical: kbd.ARROW_UP,
		}[$options.orientation ?? 'horizontal'];

		const el = e.currentTarget;
		if (!isHTMLElement(el)) return;
		const root = el.closest<HTMLElement>('[data-melt-toolbar]');
		if (!isHTMLElement(root)) return;

		const items = Array.from(
			root.querySelectorAll<HTMLElement>(`${selector('item')}, ${selector('button')}`)
		);

		const currentIndex = items.indexOf(el);

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
	};
