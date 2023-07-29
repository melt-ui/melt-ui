import type { BuilderReturn, Orientation } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createRadioGroup } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateRadioGroupProps = {
	/**
	 * When `true`, prevents the user from interacting with the radio group.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * When `true`, indicates that the user must select a radio button before
	 * the owning form can be submitted.
	 *
	 * @default false
	 */
	required?: boolean;

	/**
	 * Whether or not the radio group should loop around when the end
	 * is reached.
	 *
	 * @default false
	 */
	loop?: boolean;

	/**
	 * The orientation of the radio group.
	 *
	 * @default 'horizontal'
	 */
	orientation?: Orientation;

	/**
	 * The uncontrolled default value of the radio group.
	 *
	 * @default undefined
	 */
	defaultValue?: string;

	/**
	 * The controlled value store for the radio group.
	 * If provided, this will override the value passed to `defaultValue`.
	 */
	value?: Writable<string>;

	/**
	 * The callback invoked when the value store of the radio group changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<string>;
};

export type RadioGroupItemProps =
	| {
			value: string;
			disabled?: boolean;
	  }
	| string;

export type RadioGroup = BuilderReturn<typeof createRadioGroup>;
export type RadioGroupElements = RadioGroup['elements'];
export type RadioGroupOptions = RadioGroup['options'];
export type RadioGroupStates = RadioGroup['states'];
export type RadioGroupHelpers = RadioGroup['helpers'];
