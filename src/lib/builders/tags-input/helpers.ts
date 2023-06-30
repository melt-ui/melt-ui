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

export type inputPos = 'default' | 'start' | 'end';

export function focusInput(id: string, pos: inputPos = 'default') {
	const inputEl = getElementByMeltId(id) as HTMLInputElement;
	if (inputEl) {
		inputEl.focus();
		if (pos === 'start') inputEl.setSelectionRange(0, 0);
		else if (pos === 'end') inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
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

export function setSelectedTagFromElement(el: Element | null, selectedTag: Writable<Tag | null>) {
	if (el) {
		selectedTag.set({
			id: el.getAttribute('data-tag-id') ?? '',
			value: el.getAttribute('data-tag-value') ?? '',
		});
	} else {
		selectedTag.set(null);
	}
}

export function setInvalid(rootId: string, inputId: string, inputStore: Writable<boolean>) {
	const rootEl = getElementByMeltId(rootId);
	const inputEl = getElementByMeltId(inputId);

	if (rootEl) rootEl.setAttribute('data-invalid', '');
	if (inputEl) inputEl.setAttribute('data-invalid', '');

	inputStore.set(true);
}

export function clearInvalid(rootId: string, inputId: string, inputStore: Writable<boolean>) {
	const rootEl = getElementByMeltId(rootId);
	const inputEl = getElementByMeltId(inputId);
	if (rootEl) rootEl.removeAttribute('data-invalid');
	if (inputEl) inputEl.removeAttribute('data-invalid');

	inputStore.set(false);
}
