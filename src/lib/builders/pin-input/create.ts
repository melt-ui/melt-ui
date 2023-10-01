import {
	addMeltEventListener,
	builder,
	createElHelpers,
	disabledAttr,
	executeCallbacks,
	generateId,
	isBrowser,
	isHTMLElement,
	isHTMLInputElement,
	last,
	next,
	omit,
	overridable,
	prev,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { tick } from 'svelte';
import { derived, get, readonly, writable } from 'svelte/store';
import type { PinInputEvents } from './events.js';
import type { CreatePinInputProps } from './types.js';

const { name, selector } = createElHelpers<'input' | 'hidden-input'>('pin-input');

const getInputs = (node: HTMLInputElement) => {
	const rootEl = node.closest(selector());
	if (!isHTMLElement(rootEl)) {
		return { inputs: null, el: node, elIndex: -1 };
	}
	const inputs = Array.from(rootEl.querySelectorAll(selector('input'))).filter(
		(input): input is HTMLInputElement => isHTMLInputElement(input)
	);
	return {
		elIndex: inputs.indexOf(node),
		inputs,
	};
};

const defaults = {
	placeholder: '○',
	disabled: false,
	type: 'text',
	name: undefined,
	defaultValue: [],
	mask: false,
} satisfies Defaults<CreatePinInputProps>;

export function createPinInput(props?: CreatePinInputProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreatePinInputProps;

	const options = toWritableStores(omit(withDefaults, 'value'));
	const { placeholder, disabled, type, name: nameStore, mask } = options;

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults?.onValueChange);
	const valueStr = derived(value, (v) => v.join(''));

	const ids = {
		root: generateId(),
	};

	const root = builder(name(), {
		stores: value,
		returned: ($value) => {
			return {
				id: ids.root,
				'data-complete': $value.length && $value.every((v) => v.length > 0) ? '' : undefined,
			};
		},
	});

	let index = 0;

	const getTotalItems = () => {
		if (!isBrowser) return Infinity;
		const rootEl = document.getElementById(ids.root);
		if (!rootEl) return Infinity;

		const inputs = Array.from(rootEl.querySelectorAll(selector('input')));
		return inputs.length;
	};

	const input = builder(name('input'), {
		stores: [value, placeholder, disabled, type, mask],
		returned: ([$value, $placeholder, $disabled, $type, $mask]) => {
			return () => {
				const totalItems = getTotalItems();
				const currIndex = index % totalItems;
				index = (index + 1) % totalItems;
				const currValue = $value[currIndex] ?? '';

				return {
					'data-complete': $value.length && $value.every((v) => v.length > 0) ? '' : undefined,
					placeholder: $placeholder,
					disabled: disabledAttr($disabled),
					type: $mask ? 'password' : $type,
					value: currValue,
				};
			};
		},
		action: (node: HTMLInputElement): MeltActionReturn<PinInputEvents['input']> => {
			const { elIndex } = getInputs(node);
			value.update((v) => {
				v[elIndex] = node.value;
				return v;
			});

			const unsub = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					const { inputs, elIndex } = getInputs(node);
					if (!inputs) return;

					if (e.key === 'Backspace') {
						e.preventDefault();
						if (node.value) {
							node.value = '';
							tick().then(() => (node.placeholder = ''));
							value.set(inputs.map((input) => input.value.slice(-1) ?? undefined));
						} else {
							const prevEl = prev(inputs, elIndex, false);
							prevEl.focus();
							prevEl.value = '';
							tick().then(() => (prevEl.placeholder = ''));
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
				addMeltEventListener(node, 'input', (e) => {
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
				addMeltEventListener(node, 'paste', (e) => {
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
				addMeltEventListener(node, 'change', () => {
					const { inputs } = getInputs(node);
					if (!inputs) return;
					value.set(inputs.map((input) => input.value.slice(-1) ?? undefined));
				}),
				addMeltEventListener(node, 'focus', () => {
					node.setSelectionRange(1, 1);
					node.placeholder = '';
					tick().then(() => {
						node.placeholder = '';
					});
				}),
				addMeltEventListener(node, 'blur', () => {
					node.placeholder = get(placeholder);
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
		stores: [value, nameStore],
		returned: ([$value, $nameStore]) => ({
			value: $value,
			name: $nameStore,
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
		elements: {
			root,
			input,
			hiddenInput,
		},
		states: {
			value,
			valueStr: readonly(valueStr),
		},
		helpers: {
			clear,
		},
		options,
	};
}
