import {
	builder,
	createElHelpers,
	omit,
	overridable,
	styleToString,
	toWritableStores,
	addMeltEventListener,
} from '$lib/internal/helpers';
import type { Defaults, MeltActionReturn } from '$lib/internal/types';
import { get, writable, readonly } from 'svelte/store';
import type { CreateSwitchProps } from './types';

const defaults = {
	defaultChecked: false,
	disabled: false,
	required: false,
	name: '',
	value: '',
} satisfies Defaults<CreateSwitchProps>;

const { name } = createElHelpers('switch');

export function createSwitch(props?: CreateSwitchProps) {
	const propsWithDefaults = { ...defaults, ...props } satisfies CreateSwitchProps;

	const options = toWritableStores(omit(propsWithDefaults, 'checked'));
	const { disabled, required, name: nameStore, value } = options;

	const checkedWritable = propsWithDefaults.checked ?? writable(propsWithDefaults.defaultChecked);
	const checked = overridable(checkedWritable, propsWithDefaults?.onCheckedChange);

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
		action(node: HTMLElement): MeltActionReturn<'click'> {
			const unsub = addMeltEventListener(node, 'click', () => {
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

	return {
		elements: {
			root,
			input,
		},
		states: {
			checked: readonly(checked),
		},
		options,
	};
}
