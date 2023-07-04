import { getElementByMeltId } from '@melt-ui/svelte/internal/helpers';
import type { Writable } from 'svelte/store';
import type { Tag } from './types';

export function focusInput(id: string, pos: 'default' | 'start' | 'end' = 'default') {
	const inputEl = getElementByMeltId(id) as HTMLInputElement;
	if (!inputEl) return;

	inputEl.focus();
	if (pos === 'start') inputEl.setSelectionRange(0, 0);
	else if (pos === 'end') inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
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

export function setDataInvalid(
	ids: { root: string; input: string },
	inputStore: Writable<boolean>
) {
	getElementByMeltId(ids.root)?.setAttribute('data-invalid', '');
	getElementByMeltId(ids.input)?.setAttribute('data-invalid', '');
	inputStore.set(true);
}

export function clearDataInvalid(
	ids: { root: string; input: string },
	inputStore: Writable<boolean>
) {
	getElementByMeltId(ids.root)?.removeAttribute('data-invalid');
	getElementByMeltId(ids.input)?.removeAttribute('data-invalid');
	inputStore.set(false);
}
