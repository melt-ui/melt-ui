import { derived } from 'svelte/store';
import { createListbox } from '../listbox/create.js';
import type { CreateSelectProps, SelectSelected } from './types.js';

export function createSelect<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends SelectSelected<Multiple, Value> = SelectSelected<Multiple, Value>,
>(props?: CreateSelectProps<Value, Multiple, S>) {
	const listbox = createListbox({ ...props, builder: 'select' });

	const selectedLabel = derived(listbox.states.selected, ($selected) => {
		if (Array.isArray($selected)) {
			return $selected.map((o) => o.label).join(', ');
		}
		return $selected?.label ?? '';
	});

	return {
		...listbox,

		elements: {
			...listbox.elements,
		},
		states: {
			...listbox.states,
			selectedLabel,
		},
	};
}
