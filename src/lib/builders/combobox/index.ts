import { generateId } from '@melt-ui/svelte/internal/helpers';
import type { Action } from 'svelte/action';
import { writable, type Readable, type Writable, readonly } from 'svelte/store';
import type { HTMLAttributes, HTMLInputAttributes, HTMLLabelAttributes } from 'svelte/elements';
import type { Defaults } from '$lib/internal/types';

interface ComboboxProps<T> {
	items: Writable<T[]>;
	/** @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#block */
	scrollAlignment?: 'nearest' | 'center';
	itemToString: (item: T) => string;
	filterFunction: (value: string) => void;
	selectItem?: (item: T) => void;
}

interface Combobox<T> {
	isOpen: Readable<boolean>;
	filterInput: Action<HTMLInputElement, void>;
	listItem: Action<HTMLLIElement, void>;
	// @TODO: support OL, DL, div, nav, etc
	list: Action<HTMLUListElement, void>;
	filterInputAttributes: Readable<HTMLInputAttributes>;
	labelAttributes: HTMLLabelAttributes;
	listAttributes: HTMLAttributes<HTMLUListElement | HTMLOListElement | HTMLDListElement>;
	selectedItem: Readable<T>;
	inputValue: Readable<string>;
}

const defaults = {
	scrollAlignment: 'nearest',
};

export function createCombobox<T>(args: ComboboxProps<T>): Combobox<T> {
	const withDefaults = { ...defaults, ...args } as ComboboxProps<T>;

	const id = generateId();
	const isOpen = writable(false);
	const selectedItem = writable<T>(undefined);
	const itemCount = writable(0);
	const trapFocus = false;
	const inputValue = writable('');

	return {
		inputValue: readonly(inputValue),
		selectedItem: readonly(selectedItem),
		isOpen: readonly(isOpen),
		// filterInput,
		// filterInputAttributes,
		// labelAttributes,
		// listAttributes,
		// list,
		// listItem,
	};
}
