import {
	effect,
	elementDerived,
	generateId,
	isBrowser,
	omit,
	styleToString,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';

export type CreateLabelArgs = {
	/**
	 * Determines whether required form elements are marked with an asterisk.
	 */
	isRequired?: boolean;
};

const defaults = {
	isRequired: false,
} satisfies Defaults<CreateLabelArgs>;

export function createLabel(args: CreateLabelArgs = defaults) {
	const withDefaults = { ...defaults, ...args } as CreateLabelArgs;
	const options = writable(withDefaults);

	const root = derived(options, () => {
		const id = generateId();
		return {
			id,
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
		asterisk,
	};
}
