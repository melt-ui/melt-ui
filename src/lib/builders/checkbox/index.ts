import {
	addEventListener,
	builder,
	executeCallbacks,
	kbd,
	styleToString,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';

type CheckedState = boolean | 'indeterminate';

export type CreateCheckboxArgs = {
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
} satisfies Defaults<CreateCheckboxArgs>;

export function createCheckbox(args: CreateCheckboxArgs = {}) {
	const argsWithDefaults = { ...defaults, ...args };
	const options = writable({
		disabled: argsWithDefaults.disabled,
		required: argsWithDefaults.required,
		name: argsWithDefaults.name,
		value: argsWithDefaults.value,
	});
	const checked = writable(argsWithDefaults.checked);

	const root = builder('checkbox', {
		stores: [checked, options],
		returned: ([$checked, $options]) => {
			return {
				'data-disabled': $options.disabled,
				'data-state':
					$checked === 'indeterminate' ? 'indeterminate' : $checked ? 'checked' : 'unchecked',
				type: 'button',
				role: 'checkbox',
				'aria-checked': $checked === 'indeterminate' ? 'mixed' : $checked,
				'aria-required': $options.required,
			} as const;
		},
		action(node: HTMLElement) {
			const unsub = executeCallbacks(
				addEventListener(node, 'keydown', (event) => {
					// According to WAI ARIA, Checkboxes don't activate on enter keypress
					if (event.key === kbd.ENTER) event.preventDefault();
				})
			);
			addEventListener(node, 'click', () => {
				const $options = get(options);
				if ($options.disabled) return;

				checked.update((value) => {
					if (value === 'indeterminate') return true;
					return !value;
				});
			});

			return {
				destroy: unsub,
			};
		},
	});

	const input = builder('checkbox-input', {
		stores: [checked, options],
		returned: ([$checked, $options]) => {
			return {
				type: 'checkbox' as const,
				'aria-hidden': true,
				hidden: true,
				tabindex: -1,
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
		},
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
