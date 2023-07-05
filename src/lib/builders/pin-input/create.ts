import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	last,
	next,
	omit,
	prev,
	styleToString,
} from '$lib/internal/helpers';
import type { Defaults } from '@melt-ui/svelte/internal/types';
import { tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import type { CreatePinInputArgs } from './types';

const { name, selector } = createElHelpers<'input' | 'hidden-input'>('pin-input');

const getInputs = (node: HTMLElement) => {
	const rootEl = node.closest(selector());
	if (!rootEl) return { inputs: null, el: node as HTMLInputElement, elIndex: -1 };
	const inputs = Array.from(rootEl.querySelectorAll(selector('input'))) as HTMLInputElement[];
	return {
		elIndex: inputs.indexOf(node as HTMLInputElement),
		inputs,
	};
};

const defaults = {
	placeholder: '○',
	disabled: false,
	type: 'text',
} satisfies Defaults<CreatePinInputArgs>;

export function createPinInput(args?: CreatePinInputArgs) {
	const withDefaults = { ...defaults, ...args };
	const options = writable(omit(withDefaults, 'value'));

	const value = writable((args?.value ?? []) as string[]);
	const valueStr = derived(value, (v) => v.join(''));

	const root = builder(name(), {
		stores: value,
		returned: ($value) => {
			return {
				'data-complete': $value.length && $value.every((v) => v.length > 0) ? '' : undefined,
			};
		},
	});

	const input = builder(name('input'), {
		stores: [value, options],
		returned: ([$value, $options]) => {
			return {
				'data-complete': $value.length && $value.every((v) => v.length > 0) ? '' : undefined,
				placeholder: $options.placeholder,
				disabled: $options.disabled,
				type: $options.type,
			};
		},
		action: (node: HTMLInputElement) => {
			const { elIndex } = getInputs(node);
			value.update((v) => {
				v[elIndex] = node.value;
				return v;
			});

			const unsub = executeCallbacks(
				addEventListener(node, 'keydown', (e) => {
					const { inputs, elIndex } = getInputs(node);
					if (!inputs) return;

					if (e.key === 'Backspace') {
						if (node.value.length === 0) {
							e.preventDefault();
							const prevEl = prev(inputs, elIndex, false);
							prevEl.focus();
						} else {
							node.value = '';
							tick().then(() => (node.placeholder = ''));
							value.set(inputs.map((input) => input.value.slice(-1) ?? undefined));
						}
					}

					if (e.key === 'Delete') {
						e.preventDefault();
						node.value = '';
						tick().then(() => (node.placeholder = ''));
					}

					if (e.key === 'ArrowLeft') {
						e.preventDefault();
						const prevEl = prev(inputs, elIndex, false);
						prevEl.focus();
					}

					if (e.key === 'ArrowRight') {
						e.preventDefault();
						const nextEl = next(inputs, elIndex, false);
						nextEl.focus();
					}

					if (e.key === 'Home') {
						e.preventDefault();
						inputs[0].focus();
					}

					if (e.key === 'End') {
						e.preventDefault();
						last(inputs).focus();
					}
				}),
				addEventListener(node, 'input', (e) => {
					const { inputs, elIndex } = getInputs(node);
					if (!inputs) return;

					const getInputted = (el: HTMLInputElement) => {
						const $value = get(value);
						const prevElValue = $value[elIndex];
						const selectionStart = el.selectionStart ?? 1;
						if (!prevElValue) return el.value;

						return selectionStart > 1
							? el.value.slice(1)
							: el.value.slice(0, Math.max(el.value.length - 2, 1));
					};
					const inputted = getInputted(node);

					const inputEvent = e as InputEvent;
					if (inputEvent.inputType === 'insertFromPaste') {
						return;
					}
					// Only allow 1 character, get last
					node.value = inputted.slice(-1);

					if (node.value.length !== 0) {
						const nextEl = next(inputs, elIndex, false);
						nextEl.focus();
					}

					value.set(inputs.map((input) => input.value.slice(-1) ?? undefined));
				}),
				addEventListener(node, 'paste', (e) => {
					e.preventDefault();
					const { inputs, elIndex } = getInputs(node);
					if (!inputs) return;

					const inputEvent = e as ClipboardEvent;
					const clipboardData = inputEvent.clipboardData;
					if (!clipboardData) return;

					const pasted = clipboardData.getData('text');
					const initialIndex = pasted.length >= inputs.length ? 0 : elIndex;
					const lastIndex = Math.min(initialIndex + pasted.length, inputs.length);
					for (let i = initialIndex; i < lastIndex; i++) {
						const input = inputs[i];
						input.value = pasted[i - initialIndex];
						input.focus();
					}
					inputs[lastIndex]?.focus();
					value.set(inputs.map((input) => input.value.slice(-1) ?? undefined));
				}),
				addEventListener(node, 'change', () => {
					const { inputs } = getInputs(node);
					if (!inputs) return;
					value.set(inputs.map((input) => input.value.slice(-1) ?? undefined));
				}),
				addEventListener(node, 'focus', () => {
					node.setSelectionRange(1, 1);
					node.placeholder = '';
					tick().then(() => {
						node.placeholder = '';
					});
				}),
				addEventListener(node, 'blur', () => {
					const $options = get(options);
					node.placeholder = $options.placeholder;
				})
			);

			return {
				destroy() {
					unsub();
				},
			};
		},
	});

	const hiddenInput = builder(name('hidden-input'), {
		stores: [value, options],
		returned: ([$value, $options]) => ({
			value: $value,
			name: $options.name,
			hidden: true,
			style: styleToString({
				display: 'none',
			}),
		}),
	});

	const clear = () => {
		value.update((v) => {
			v.forEach((_, i) => (v[i] = ''));
			return v;
		});
	};

	return {
		root,
		input,
		hiddenInput,
		value,
		valueStr,
		options,
		clear,
	};
}
