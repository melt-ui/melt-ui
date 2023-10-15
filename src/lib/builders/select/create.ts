import { builder, createElHelpers } from '$lib/internal/helpers/index.js';
import { derived } from 'svelte/store';
import { createListbox } from '../listbox/create.js';
import type { CreateSelectProps, SelectSelected } from './types.js';

type SelectParts =
	| 'menu'
	| 'trigger'
	| 'option'
	| 'group'
	| 'group-label'
	| 'arrow'
	| 'hidden-input'
	| 'label';

const { name } = createElHelpers<SelectParts>('select');

export function createSelect<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends SelectSelected<Multiple, Value> = SelectSelected<Multiple, Value>
>(props?: CreateSelectProps<Value, Multiple, S>) {
	const listbox = createListbox({ ...props, builder: 'select' });

	const group = builder(name('group'), {
		returned: () => {
			return (groupId: string) => ({
				role: 'group',
				'aria-labelledby': groupId,
			});
		},
	});

	const groupLabel = builder(name('group-label'), {
		returned: () => {
			return (groupId: string) => ({
				id: groupId,
			});
		},
	});

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
			group,
			groupLabel,
		},
		states: {
			...listbox.states,
			selectedLabel,
		},
	};
}
