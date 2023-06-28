import { getElementByMeltId } from '@melt-ui/svelte/internal/helpers';
import { get, type Writable } from 'svelte/store';

export type Tag = {
	id: string;
	value: string;
};

export type TagArgs = {
	id: string;
	value: string;
	disabled?: boolean;
};

export function focusInput(id: string) {
	const inputEl = getElementByMeltId(id) as HTMLInputElement;
	if (inputEl) {
		inputEl.focus();
		inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length); // set caret at the end
	}
}

export function deleteTagById(id: string, tags: Writable<Tag[]>) {
	const $tags = get(tags);
	const index = $tags.findIndex((tag) => tag.id === id);
	tags.update((t) => {
		t.splice(index, 1);
		return t;
	});
}
