import { useEscapeKeydown } from '$lib/internal/actions/index.js';
import {
	addEventListener,
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	isHTMLInputElement,
	kbd,
	noop,
	omit,
} from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { writable } from 'svelte/store';
import { createListbox } from '../listbox/create.js';
import type { ComboboxEvents } from './events.js';
import type { ComboboxSelected, CreateComboboxProps } from './types.js';

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

const { name } = createElHelpers('combobox');

/**
 * Creates an ARIA-1.2-compliant combobox.
 *
 * @TODO expose a nice mechanism for clearing the input.
 * @TODO would it be useful to have a callback for when an item is selected?
 * @TODO multi-select using `tags-input` builder?
 */
export function createCombobox<
	Value,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends ComboboxSelected<Multiple, Value> = ComboboxSelected<Multiple, Value>
>(props?: CreateComboboxProps<Value, Multiple, S>) {
	const listbox = createListbox({ ...props, builder: 'combobox' });

	const inputValue = writable('');
	const touchedInput = writable(false);

	/* -------- */
	/* ELEMENTS */
	/* -------- */

	/** Action and attributes for the text input. */
	const input = builder(name('input'), {
		stores: [listbox.elements.trigger, inputValue],
		returned: ([$trigger, $inputValue]) => {
			return {
				...omit($trigger, 'action'),
				role: 'combobox',
				value: $inputValue,
			} as const;
		},
		action: (node: HTMLInputElement): MeltActionReturn<ComboboxEvents['input']> => {
			const unsubscribe = executeCallbacks(
				addMeltEventListener(node, 'input', (e) => {
					if (!isHTMLInputElement(e.target)) return;
					touchedInput.set(true);
				}),
				// This shouldn't be cancelled ever, so we don't use addMeltEventListener.
				addEventListener(node, 'input', (e) => {
					if (!isHTMLInputElement(e.target)) return;
					inputValue.set(e.target.value);
				})
			);

			let unsubEscapeKeydown = noop;

			const escape = useEscapeKeydown(node, {
				handler: () => {
					listbox.helpers.closeMenu();
				},
			});
			if (escape && escape.destroy) {
				unsubEscapeKeydown = escape.destroy;
			}

			const { destroy } = listbox.elements.trigger(node);

			return {
				destroy() {
					destroy?.();
					unsubscribe();
					unsubEscapeKeydown();
				},
			};
		},
	});

	effect(listbox.states.open, ($open) => {
		if (!$open) {
			touchedInput.set(false);
		}
	});

	return {
		...listbox,
		elements: {
			...listbox.elements,
			input,
		},
		states: {
			...listbox.states,
			touchedInput,
			inputValue,
		},
	};
}
