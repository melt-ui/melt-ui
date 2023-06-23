import { effect, elementDerived, isBrowser, omit, styleToString } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';

export type CreateLabelArgs = {
	/**
	 * The id of the element that this label is for.
	 * @default undefined
	 * */
	for?: string;
	/**
	 * The text content of the label.
	 * @default undefined
	 * */
	labelValue?: string;
	/**
	 * Determines whether required form elements are marked with an asterisk.
	 */
	isRequired?: boolean;
};

const defaults = {
	for: undefined,
	labelValue: undefined,
	isRequired: false,
} satisfies Defaults<CreateLabelArgs>;

export function createLabel(args: CreateLabelArgs = defaults) {
	const withDefaults = { ...defaults, ...args } as CreateLabelArgs;
	const options = writable(omit(withDefaults, 'labelValue'));

	const labelValue = writable(withDefaults.labelValue);

	const root = derived(options, ($options) => {
		return {
			for: $options.for,
		};
	});

	const asterisk = derived(options, ($options) => {
		const style = styleToString({
			display: $options.isRequired ? undefined : 'none',
		});

		return {
			style,
		};
	});

	effect([root], () => {
		if (!isBrowser) return;
		const mouseDown = (e: MouseEvent) => {
			if (!e.defaultPrevented && e.detail > 1) {
				e.preventDefault();
			}
		};
		document.addEventListener('mousedown', mouseDown);
		return () => {
			document.removeEventListener('mousedown', mouseDown);
		};
	});

	return {
		root,
		labelValue,
		asterisk,
	};
}
