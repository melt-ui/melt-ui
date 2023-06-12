import { elementDerived, styleToString } from '$lib/internal/helpers';
import { derived, writable } from 'svelte/store';

type CreateSwitchArgs = {
	/** The controlled checked state of the switch. */
	checked?: boolean;
	/** When `true`, prevents the user from interacting with the switch. */
	disabled?: boolean;
	/** When `true`, indicates that the user must check the switch before the owning form can be submitted. */
	required?: boolean;
	/** The name of the switch. Submitted with its owning form as part of a name/value pair. */
	name?: string;
	/** The value given as data when submitted with a `name`. */
	value?: string;
};

const defaults = {
	checked: false,
	disabled: false,
	required: false,
	name: '',
	value: '',
} satisfies CreateSwitchArgs;

export function createSwitch(args: CreateSwitchArgs = {}) {
	const argsWithDefaults = { ...defaults, ...args };
	const options = writable({
		disabled: argsWithDefaults.disabled,
		required: argsWithDefaults.required,
		name: argsWithDefaults.name,
		value: argsWithDefaults.value,
	});
	const checked = writable(argsWithDefaults.checked);

	const root = elementDerived([checked, options], ([$checked, $options], { attach }) => {
		attach('click', () => {
			if ($options.disabled) return;

			checked.update((value) => !value);
		});

		return {
			'data-disabled': $options.disabled,
			'data-state': $checked ? 'checked' : 'unchecked',
			type: 'button',
			role: 'switch',
			'aria-checked': $checked,
			'aria-required': $options.required,
		} as const;
	});

	const input = derived([checked, options], ([$checked, $options]) => {
		return {
			type: 'checkbox' as const,
			'aria-hidden': true,
			hidden: true,
			tabIndex: -1,
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
