import {
	addEventListener,
	builder,
	executeCallbacks,
	kbd,
	styleToString,
	toWritableStores,
	overridable,
	omit,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import type { CreateCheckboxProps } from './types';

const defaults = {
	disabled: false,
	required: false,
	name: undefined,
	value: undefined,
	defaultChecked: false,
} satisfies Defaults<CreateCheckboxProps>;

export function createCheckbox(props?: CreateCheckboxProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateCheckboxProps;

	const options = toWritableStores(omit(withDefaults, 'checked'));
	const { disabled, name, required, value } = options;

	// States
	const checkedWritable = withDefaults.checked ?? writable(withDefaults.defaultChecked);
	const checked = overridable(checkedWritable, withDefaults?.onCheckedChange);

	const root = builder('checkbox', {
		stores: [checked, disabled, required],
		returned: ([$checked, $disabled, $required]) => {
			return {
				'data-disabled': $disabled,
				'data-state':
					$checked === 'indeterminate' ? 'indeterminate' : $checked ? 'checked' : 'unchecked',
				type: 'button',
				role: 'checkbox',
				'aria-checked': $checked === 'indeterminate' ? 'mixed' : $checked,
				'aria-required': $required,
			} as const;
		},
		action(node: HTMLElement) {
			const unsub = executeCallbacks(
				addEventListener(node, 'keydown', (event) => {
					// According to WAI ARIA, Checkboxes don't activate on enter keypress
					if (event.key === kbd.ENTER) event.preventDefault();
				}),
				addEventListener(node, 'click', () => {
					if (get(disabled)) return;

					checked.update((value) => {
						if (value === 'indeterminate') return true;
						return !value;
					});
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const input = builder('checkbox-input', {
		stores: [checked, name, value, required, disabled],
		returned: ([$checked, $name, $value, $required, $disabled]) => {
			return {
				type: 'checkbox' as const,
				'aria-hidden': true,
				hidden: true,
				tabindex: -1,
				name: $name,
				value: $value,
				checked: $checked === 'indeterminate' ? false : $checked,
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

	const isIndeterminate = derived(checked, ($checked) => $checked === 'indeterminate');
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
			isIndeterminate,
			isChecked,
		},
		options,
	};
}
