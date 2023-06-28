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

export function focusInput(id: string, pos: 'start' | 'end') {
	const inputEl = getElementByMeltId(id) as HTMLInputElement;
	if (inputEl) {
		inputEl.focus();
		if (pos === 'start') inputEl.setSelectionRange(0, 0);
		else inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
	}
}

export function getTagElements(me: HTMLElement, rootAttribute: string, tagAttribute: string) {
	const rootEl = me.closest(`[data-melt-part="${rootAttribute}"]`) as HTMLElement;
	return Array.from(
		rootEl.querySelectorAll(`[data-melt-part="${tagAttribute}"]`)
	) as Array<HTMLElement>;
}

export function deleteTagById(id: string, tags: Writable<Tag[]>) {
	const $tags = get(tags);
	const index = $tags.findIndex((tag) => tag.id === id);
	tags.update((t) => {
		t.splice(index, 1);
		return t;
	});
}
