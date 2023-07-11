import { addEventListener, builder, createElHelpers, styleToString } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import type { CreateSwitchProps } from './types';

const defaults = {
	checked: false,
	disabled: false,
	required: false,
	name: '',
	value: '',
} satisfies Defaults<CreateSwitchProps>;

const { name } = createElHelpers('switch');

export function createSwitch(props: CreateSwitchProps = {}) {
	const propsWithDefaults = { ...defaults, ...props };
	const options = writable({
		disabled: propsWithDefaults.disabled,
		required: propsWithDefaults.required,
		name: propsWithDefaults.name,
		value: propsWithDefaults.value,
	});
	const checked = writable(propsWithDefaults.checked);

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
