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

export function createSwitch(props?: CreateSwitchProps) {
	const propsWithDefaults = { ...defaults, ...props } satisfies CreateSwitchProps;

	const disabled = writable(propsWithDefaults.disabled);
	const required = writable(propsWithDefaults.required);
	const nameStore = writable(propsWithDefaults.name);
	const value = writable(propsWithDefaults.value);

	const options = {
		disabled,
		required,
		name: nameStore,
		value,
	};

	const checked = writable(propsWithDefaults.checked);

	const root = builder(name(), {
		stores: [checked, disabled, required],
		returned: ([$checked, $disabled, $required]) => {
			return {
				'data-disabled': $disabled,
				disabled: $disabled,
				'data-state': $checked ? 'checked' : 'unchecked',
				type: 'button',
				role: 'switch',
				'aria-checked': $checked,
				'aria-required': $required,
			} as const;
		},
		action(node: HTMLElement) {
			const unsub = addEventListener(node, 'click', () => {
				if (get(disabled)) return;

				checked.update((value) => !value);
			});

			return {
				destroy: unsub,
			};
		},
	});

	const input = builder(name('input'), {
		stores: [checked, nameStore, required, disabled, value],
		returned: ([$checked, $name, $required, $disabled, $value]) => {
			return {
				type: 'checkbox' as const,
				'aria-hidden': true,
				hidden: true,
				tabindex: -1,
				name: $name,
				value: $value,
				checked: $checked,
				required: $required,
				disabled: $disabled,
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
		elements: {
			root,
			input,
		},
		states: {
			checked,
		},
		helpers: {
			isChecked,
		},
		options,
	};
}
