import { element, elementDerived } from '$lib/internal/helpers';
import { derived, writable } from 'svelte/store';

export function createSelect() {
	const open = writable(false);
	const selected = writable<string | null>(null);

	const trigger = element((createAttach) => {
		const attach = createAttach();
		attach('click', () => {
			open.update((prev) => !prev);
		});
	});

	const menu = derived(open, ($open) => {
		return {
			hidden: $open ? undefined : true,
		};
	});

	type OptionArgs = {
		value: string;
	};

	const option = elementDerived(selected, ($selected, createAttach) => {
		return ({ value }: OptionArgs) => {
			const attach = createAttach();
			attach('click', () => {
				selected.set(value);
				open.set(false);
			});

			return {
				role: 'option',
				'aria-selected': $selected === value ? 'true' : 'false',
			};
		};
	});

	return { trigger, menu, open, option, selected };
}
