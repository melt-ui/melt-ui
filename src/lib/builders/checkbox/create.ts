import {
	addMeltEventListener,
	builder,
	effect,
	executeCallbacks,
	kbd,
	omit,
	overridable,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived, get, writable } from 'svelte/store';
import type { CheckboxEvents } from './events.js';
import type { CreateCheckboxProps } from './types.js';

const defaults = {
	disabled: false,
	required: false,
	name: undefined,
	value: 'on',
	defaultChecked: false,
} satisfies Defaults<CreateCheckboxProps>;

export function createCheckbox(props?: CreateCheckboxProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateCheckboxProps;

	const options = toWritableStores(omit(withDefaults, 'checked', 'defaultChecked'));
	const { disabled, name, required, value } = options;

	// States
	const checkedWritable = withDefaults.checked ?? writable(withDefaults.defaultChecked);
	const checked = overridable(checkedWritable, withDefaults?.onCheckedChange);

	const root = builder('checkbox', {
		stores: [checked, disabled, required],
		returned: ([$checked, $disabled, $required]) => {
			const isIndeterminate = $checked === 'indeterminate';

			return {
				'data-disabled': $disabled ? '' : undefined,
				'data-state': isIndeterminate ? 'indeterminate' : $checked ? 'checked' : 'unchecked',
				type: 'button',
				role: 'checkbox',
				'aria-checked': isIndeterminate ? 'mixed' : $checked,
				'aria-required': $required,
				'aria-disabled': $disabled,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<CheckboxEvents['root']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					// According to WAI ARIA, Checkboxes don't activate on enter keypress
					if (e.key === kbd.ENTER) e.preventDefault();
				}),
				addMeltEventListener(node, 'click', () => {
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
				'data-required': $required ? '' : undefined,
				'data-disabled': $disabled ? '' : undefined,
				style: styleToString({
					display: 'none',
				}),
			} as const;
		},
		action: (node: HTMLInputElement) => {
			node.disabled = node.hasAttribute('data-disabled');
			node.required = node.hasAttribute('data-required');

			const unsub = effect([disabled, required], ([$disabled, $required]) => {
				node.disabled = $disabled;
				node.required = $required;
			});

			return {
				destroy: unsub,
			};
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
