import {
	addMeltEventListener,
	builder,
	createElHelpers,
	kbd,
	omit,
	overridable,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { get, writable } from 'svelte/store';
import { executeCallbacks } from '../../internal/helpers/callbacks.js';
import type { SwitchEvents } from './events.js';
import type { CreateSwitchProps } from './types.js';

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

	function toggleSwitch() {
		if (get(disabled)) return;
		checked.update((prev) => !prev);
	}

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
		action(node: HTMLElement): MeltActionReturn<SwitchEvents['root']> {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					toggleSwitch();
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
					e.preventDefault();
					toggleSwitch();
				})
			);

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
			checked,
		},
		options,
	};
}
