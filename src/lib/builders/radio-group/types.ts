import type { BuilderReturn, Orientation } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createRadioGroup } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
export type { RadioGroupComponentEvents } from './events.js';

export type CreateRadioGroupProps = {
	/**
	 * When `true`, prevents the user from interacting with the radio group.
	 *
	 * @default false
	 */
	disabled?: boolean | undefined;

	/**
	 * When `true`, indicates that the user must select a radio button before
	 * the owning form can be submitted.
	 *
	 * @default false
	 */
	required?: boolean | undefined;

	name?: string | undefined;

	/**
	 * Whether or not the radio group should loop around when the end
	 * is reached.
	 *
	 * @default false
	 */
	loop?: boolean | undefined;

	/**
	 * The orientation of the radio group.
	 *
	 * @default 'horizontal'
	 */
	orientation?: Orientation | undefined;

	/**
	 * The uncontrolled default value of the radio group.
	 *
	 * @default undefined
	 */
	defaultValue?: string | undefined;

	/**
	 * The controlled value store for the radio group.
	 * If provided, this will override the value passed to `defaultValue`.
	 */
	value?: Writable<string> | undefined;

	/**
	 * The callback invoked when the value store of the radio group changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<string> | undefined;
};

export type RadioGroupItemProps =
	| {
			value: string;
			disabled?: boolean | undefined;
	  }
	| string;

export type RadioGroup = BuilderReturn<typeof createRadioGroup>;
export type RadioGroupElements = RadioGroup['elements'];
export type RadioGroupOptions = RadioGroup['options'];
export type RadioGroupStates = RadioGroup['states'];
export type RadioGroupHelpers = RadioGroup['helpers'];
