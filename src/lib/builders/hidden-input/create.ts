import { createElHelpers, makeElement } from '$lib/internal/helpers/makeElement.js';
import { readable } from 'svelte/store';
import type { CreateHiddenInputProps } from './types.js';
import { styleToString } from '$lib/internal/helpers/style.js';
import { toReadableStores } from '$lib/internal/helpers/store/toReadableStores.js';
import { omit } from '$lib/internal/helpers/object.js';
import type { Readable } from 'svelte/motion';
import { removeUndefined } from '$lib/internal/helpers/object.js';

const defaults = {
	prefix: '',
	disabled: readable(false),
	required: readable(false),
	name: readable(undefined),
} satisfies Partial<CreateHiddenInputProps>;

export function createHiddenInput(props: CreateHiddenInputProps) {
	const withDefaults = {
		...defaults,
		...removeUndefined(props),
	} satisfies CreateHiddenInputProps;
	const { name: elName } = createElHelpers(withDefaults.prefix);
	const { value, name, disabled, required } = toReadableStores(omit(withDefaults, 'prefix'));
	const nameStore = name as Readable<string | undefined>; // TODO: Remove this cast when types are fixed

	const hiddenInput = makeElement(elName('hidden-input'), {
		stores: [value, nameStore, disabled, required],
		returned: ([$value, $name, $disabled, $required]) => {
			return {
				name: $name,
				value: $value?.toString(),
				'aria-hidden': 'true',
				hidden: true,
				disabled: $disabled,
				required: $required,
				tabIndex: -1,
				style: styleToString({
					position: 'absolute',
					opacity: 0,
					'pointer-events': 'none',
					margin: 0,
					transform: 'translateX(-100%)',
				}),
			} as const;
		},
		action: (node: HTMLInputElement) => {
			// When value changes, emit a change event
			const unsub = value.subscribe((newValue) => {
				node.value = newValue;
				node.dispatchEvent(new Event('change', { bubbles: true }));
			});

			return {
				destroy: unsub,
			};
		},
	});

	return hiddenInput;
}
