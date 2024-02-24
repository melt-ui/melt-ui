import { derived } from 'svelte/store';
import { createListbox } from '../listbox/create.js';
import type { CreateSelectProps, SelectSelected } from './types.js';

export function createSelect<Value = unknown>(props?: CreateSelectProps<Value>) {
	const listbox = createListbox({ ...props, builder: 'select' });

	const selectedLabel = derived(listbox.states.selected, ($selected) => {
		return $selected.map((o) => o.label).join(', ');
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
