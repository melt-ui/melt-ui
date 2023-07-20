import { getElementByMeltId } from '$lib/internal/helpers';
import type { Writable } from 'svelte/store';
import type { Tag } from './types';

export function focusInput(id: string, pos: 'default' | 'start' | 'end' = 'default') {
	const inputEl = getElementByMeltId(id) as HTMLInputElement;
	if (!inputEl) return;

	inputEl.focus();
	if (pos === 'start') inputEl.setSelectionRange(0, 0);
	else if (pos === 'end') inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
}

export function setSelectedFromEl(el: Element | null, selected: Writable<Tag | null>) {
	if (el) {
		selected.set({
			id: el.getAttribute('data-tag-id') ?? '',
			value: el.getAttribute('data-tag-value') ?? '',
		});
	} else {
		selected.set(null);
	}
}

export function highlightText(query: string) {
	const el = document.querySelector<HTMLElement>(query);

	if (el) {
		el.focus();
		const range = document.createRange();
		range.selectNodeContents(el);

		const selection = window.getSelection();
		if (selection) {
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
}
