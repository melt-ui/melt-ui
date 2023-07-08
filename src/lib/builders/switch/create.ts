import { addEventListener, builder, createElHelpers, styleToString } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import type { CreateSwitchArgs } from './types';

const defaults = {
	checked: false,
	disabled: false,
	required: false,
	name: '',
	value: '',
} satisfies Defaults<CreateSwitchArgs>;

const { name } = createElHelpers('switch');

export function createSwitch(args: CreateSwitchArgs = {}) {
	const argsWithDefaults = { ...defaults, ...args };
	const options = writable({
		disabled: argsWithDefaults.disabled,
		required: argsWithDefaults.required,
		name: argsWithDefaults.name,
		value: argsWithDefaults.value,
	});
	const checked = writable(argsWithDefaults.checked);

	const root = builder(name(), {
		stores: [checked, options],
		returned: ([$checked, $options]) => {
			return {
				'data-disabled': $options.disabled,
				disabled: $options.disabled,
				'data-state': $checked ? 'checked' : 'unchecked',
				type: 'button',
				role: 'switch',
				'aria-checked': $checked,
				'aria-required': $options.required,
			} as const;
		},
		action(node: HTMLElement) {
			const unsub = addEventListener(node, 'click', () => {
				const $options = get(options);
				if ($options.disabled) return;

				checked.update((value) => !value);
			});

			return {
				destroy: unsub,
			};
		},
	});

	const input = builder(name('input'), {
		stores: [checked, options],
		returned: ([$checked, $options]) => {
			return {
				type: 'checkbox' as const,
				'aria-hidden': true,
				hidden: true,
				tabindex: -1,
				name: $options.name,
				value: $options.value,
				checked: $checked,
				required: $options.required,
				disabled: $options.disabled,
				style: styleToString({
					position: 'absolute',
					opacity: 0,
					'pointer-events': 'none',
					margin: 0,
					transform: 'translateX(-100%)',
				}),
			} as const;
		},
	});

	const isChecked = derived(checked, ($checked) => $checked === true);

	return {
		root,
		input,
		checked,
		isChecked,
		options,
	};
}
