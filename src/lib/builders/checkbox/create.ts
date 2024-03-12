import {
	addMeltEventListener,
	disabledAttr,
	executeCallbacks,
	kbd,
	makeElement,
	styleToString,
} from '$lib/internal/helpers/index.js';
import { parseProps } from '$lib/internal/helpers/props.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived } from 'svelte/store';
import type { CheckboxEvents } from './events.js';
import type { CreateCheckboxProps } from './types.js';

const defaults = {
	disabled: false,
	required: false,
	name: undefined,
	value: 'on',
	checked: false,
} satisfies Defaults<CreateCheckboxProps>;

export function createCheckbox(props?: CreateCheckboxProps) {
	const { checked, ...options } = parseProps(props, defaults);
	const { disabled, name, required, value } = options;

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

	const input = makeElement('checkbox-input', {
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
				disabled: disabledAttr($disabled),
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
