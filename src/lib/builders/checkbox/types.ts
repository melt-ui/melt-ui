import type { createCheckbox } from './create';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateCheckboxProps = {
	/**
	 * When `true`, the checkbox will be disabled.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * When `true`, indicates that the user must check the checkbox before the owning form can be submitted.
	 *
	 * @default false;
	 */
	required?: boolean;

	/**
	 * The name of the checkbox. Submitted with its owning form as part of a name/value pair.
	 *
	 * @default undefined
	 */
	name?: string;

	/**
	 * The value given as data when submitted with a `name`.
	 *
	 * @default undefined
	 */
	value?: string;

	/**
	 * The uncontrolled default checked status of the checkbox.
	 *
	 * @default false
	 */
	defaultChecked?: boolean | 'indeterminate';

	/**
	 * The controlled checked state store of the checkbox.
	 * If provided, this will override the value passed to `defaultChecked`.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	checked?: Writable<boolean | 'indeterminate'>;

	/**
	 * The callback invoked when the checked state store of the checkbox changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onCheckedChange?: ChangeFn<boolean | 'indeterminate'>;
};

export type Checkbox = BuilderReturn<typeof createCheckbox>;

export type CheckboxElements = Checkbox['elements'];
export type CheckboxOptions = Checkbox['options'];
export type CheckboxStates = Checkbox['states'];
export type CheckboxHelpers = Checkbox['helpers'];
