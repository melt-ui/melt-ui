import { elementDerived, styleToString } from '@melt-ui/svelte/internal/helpers';
import { derived, writable } from 'svelte/store';

type CheckedState = boolean | 'indeterminate';

type CreateCheckboxArgs = {
	checked?: CheckedState;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	value?: string;
};

const defaults = {
	checked: false,
	disabled: false,
	required: false,
	name: '',
	value: '',
} satisfies CreateCheckboxArgs;

export function createCheckbox(args: CreateCheckboxArgs = {}) {
	const argsWithDefaults = { ...defaults, ...args };
	const options = writable({
		disabled: argsWithDefaults.disabled,
		required: argsWithDefaults.required,
		name: argsWithDefaults.name,
		value: argsWithDefaults.value,
	});
	const checked = writable(argsWithDefaults.checked);

	const root = elementDerived([checked, options], ([$checked, $options], attach) => {
		attach('keydown', (event) => {
			// According to WAI ARIA, Checkboxes don't activate on enter keypress
			if (event.key === 'Enter') event.preventDefault();
		});

		attach('click', () => {
			if ($options.disabled) return;

			checked.update((value) => {
				if (value === 'indeterminate') return true;
				return !value;
			});
		});

		return {
			'data-disabled': $options.disabled,
			'data-state':
				$checked === 'indeterminate' ? 'indeterminate' : $checked ? 'checked' : 'unchecked',
			type: 'button',
			role: 'checkbox',
			'aria-checked': $checked === 'indeterminate' ? 'mixed' : $checked,
			'aria-required': $options.required,
		} as const;
	});

	const input = elementDerived([checked, options], ([$checked, $options]) => {
		return {
			type: 'checkbox' as const,
			'aria-hidden': true,
			hidden: true,
			tabIndex: -1,
			name: $options.name,
			value: $options.value,
			checked: $checked === 'indeterminate' ? false : $checked,
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

	const isIndeterminate = derived(checked, ($checked) => $checked === 'indeterminate');
	const isChecked = derived(checked, ($checked) => $checked === true);

	return {
		root,
		input,
		checked,
		isIndeterminate,
		isChecked,
		options,
	};
}
