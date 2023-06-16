import { elementMultiDerived, omit } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';
import { createToolbar, getKeydownHandler } from '.';

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
	toolbarOptions: ReturnType<typeof createToolbar>['options'];
};

const defaults = {
	type: 'single',
	disabled: false,
	value: null,
} satisfies Defaults<CreateToolbarGroupArgs>;

export function createToolbarGroup(args: CreateToolbarGroupArgs) {
	const withDefaults = { ...defaults, ...args };
	const options = writable(omit(withDefaults, 'value', 'toolbarOptions'));
	const toolbarOptions = withDefaults.toolbarOptions;

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

	const root = derived(toolbarOptions, ($toolbarOptions) => {
		return {
			role: 'group',
			'data-orientation': $toolbarOptions.orientation,
		} as const;
	});

	type ToolbarGroupItemArgs =
		| {
				value: string;
				disabled?: boolean;
		  }
		| string;
	const item = elementMultiDerived(
		[options, value, toolbarOptions],
		([$options, $value, $toolbarOptions], { attach }) => {
			return (args: ToolbarGroupItemArgs) => {
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

				attach('keydown', getKeydownHandler($toolbarOptions));

				const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
				const anyPressed = Array.isArray($value) ? $value.length > 0 : $value !== null;
				return {
					disabled,
					pressed,
					'data-orientation': $toolbarOptions.orientation,
					'data-disabled': disabled ? '' : undefined,
					'data-state': pressed ? 'on' : 'off',
					'aria-pressed': pressed,
					type: 'button',
					role: $options.type === 'single' ? 'radio' : undefined,
					'data-melt-part': 'toolbar-item',
					tabindex: anyPressed ? (pressed ? 0 : -1) : 0,
				} as const;
			};
		}
	);

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
