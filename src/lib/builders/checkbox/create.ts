import {
	addMeltEventListener,
	makeElement,
	disabledAttr,
	executeCallbacks,
	kbd,
	omit,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived, writable } from 'svelte/store';
import type { CheckboxEvents } from './events.js';
import type { CreateCheckboxProps } from './types.js';
import { createHiddenInput } from '../hidden-input/create.js';

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

	const root = makeElement('checkbox', {
		stores: [checked, disabled, required],
		returned: ([$checked, $disabled, $required]) => {
			return {
				'data-disabled': disabledAttr($disabled),
				disabled: disabledAttr($disabled),
				'data-state':
					$checked === 'indeterminate' ? 'indeterminate' : $checked ? 'checked' : 'unchecked',
				type: 'button',
				role: 'checkbox',
				'aria-checked': $checked === 'indeterminate' ? 'mixed' : $checked,
				'aria-required': $required,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<CheckboxEvents['root']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					// According to WAI ARIA, Checkboxes don't activate on enter keypress
					if (e.key === kbd.ENTER) e.preventDefault();
				}),
				addMeltEventListener(node, 'click', () => {
					if (disabled.get()) return;

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

	const input = createHiddenInput({
		value,
		checked,
		type: 'checkbox',
		name: name,
		disabled: disabled,
		required,
		prefix: 'checkbox',
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
