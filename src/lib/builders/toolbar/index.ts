import {
	addEventListener,
	executeCallbacks,
	handleRovingFocus,
	hiddenAction,
	isHTMLElement,
	kbd,
	omit,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable, type Readable } from 'svelte/store';

type CreateToolbarArgs = {
	loop?: boolean;
	orientation?: 'horizontal' | 'vertical';
};

type SingleToolbarGroupRootArgs = {
	type?: 'single';
	value?: string | null;
};

type MultipleToolbarGroupRootProps = {
	type: 'multiple';
	value?: string[];
};

export type CreateToolbarGroupArgs = (
	| SingleToolbarGroupRootArgs
	| MultipleToolbarGroupRootProps
) & {
	disabled?: boolean;
};

const defaults = {
	loop: true,
	orientation: 'horizontal',
} satisfies Defaults<CreateToolbarArgs>;

export function createToolbar(args: CreateToolbarArgs = {}) {
	const withDefaults = { ...defaults, ...args };
	const toolbarOptions = writable({ ...withDefaults });

	const root = derived(toolbarOptions, ($toolbarOptions) => {
		return {
			role: 'toolbar',
			'data-orientation': $toolbarOptions.orientation,
			'data-melt-toolbar': '',
		};
	});

	const button = hiddenAction({
		role: 'button',
		type: 'button',
		'data-melt-toolbar-item': '',
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'keydown', getKeydownHandler(toolbarOptions));

			return {
				destroy: unsub,
			};
		},
		tabIndex: -1,
	} as const);

	const link = hiddenAction({
		role: 'link',
		'data-melt-toolbar-item': '',
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'keydown', getKeydownHandler(toolbarOptions));

			return {
				destroy: unsub,
			};
		},
		tabIndex: -1,
	} as const);

	const separator = derived(toolbarOptions, ($toolbarOptions) => {
		return {
			role: 'separator',
			'data-orientation': $toolbarOptions.orientation === 'horizontal' ? 'vertical' : 'horizontal',
			'aria-orientation': $toolbarOptions.orientation === 'horizontal' ? 'vertical' : 'horizontal',
			'data-melt-toolbar-separator': '',
		} as const;
	});

	const groupDefaults = {
		type: 'single',
		disabled: false,
		value: null,
	} satisfies CreateToolbarGroupArgs;

	function createToolbarGroup(args: CreateToolbarGroupArgs = {}) {
		const groupWithDefaults = { ...groupDefaults, ...args };
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

		const root = derived(toolbarOptions, ($toolbarOptions) => {
			return {
				role: 'group',
				'data-orientation': $toolbarOptions.orientation,
				'data-melt-toolbar-group': '',
			} as const;
		});

		type ToolbarGroupItemArgs =
			| {
					value: string;
					disabled?: boolean;
			  }
			| string;
		const item = {
			...derived(
				[groupOptions, value, toolbarOptions],
				([$groupOptions, $value, $toolbarOptions]) => {
					return (args: ToolbarGroupItemArgs) => {
						const itemValue = typeof args === 'string' ? args : args.value;
						const argDisabled = typeof args === 'string' ? false : !!args.disabled;
						const disabled = $groupOptions.disabled || argDisabled;

						const pressed = Array.isArray($value)
							? $value.includes(itemValue)
							: $value === itemValue;

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
				}
			),
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
		};

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
	return Array.from(element.querySelectorAll<HTMLElement>('[data-melt-toolbar-item]'));
}

const getKeydownHandler =
	(options: Readable<Pick<CreateToolbarArgs, 'orientation' | 'loop'>>) => (e: KeyboardEvent) => {
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

		const items = Array.from(root.querySelectorAll<HTMLElement>('[data-melt-toolbar-item]'));

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
