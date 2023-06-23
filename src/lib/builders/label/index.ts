import { elementDerived, omit, styleToString } from '$lib/internal/helpers';
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

	const labelContainer = derived(options, ($options) => {
		const requiredStyles = $options.isRequired ? "after:content-['_*']" : null;
		return {
			class: requiredStyles,
		};
	});

	return {
		root,
		labelContainer,
		labelValue,
	};
}
