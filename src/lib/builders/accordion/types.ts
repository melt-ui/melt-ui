import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createAccordion } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type AccordionType = 'single' | 'multiple';

export type CreateAccordionProps<T extends AccordionType = 'single'> = {
	/**
	 * The type of accordion.
	 *
	 * @default 'single'
	 */
	type?: T;

	/**
	 * When `true`, prevents the user from interacting with the accordion.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Whether the accordion content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: boolean;

	/**
	 * The uncontrolled default value of the accordion.
	 */
	defaultValue?: T extends 'single' ? string : string[];

	/**
	 * The controlled value store for the accordion.
	 * If provided, this will override the value passed to `defaultValue`.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	value?: T extends 'single' ? Writable<string | undefined> : Writable<string[] | undefined>;

	/**
	 * A callback called when the value of the `value` store should be changed.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: T extends 'single'
		? ChangeFn<string | undefined>
		: ChangeFn<string[] | undefined>;
};

export type AccordionItemProps =
	| {
			value: string;
			disabled?: boolean;
	  }
	| string;

export type AccordionHeadingProps =
	| {
			level: 1 | 2 | 3 | 4 | 5 | 6;
	  }
	| number;

export type Accordion = BuilderReturn<typeof createAccordion>;
export type AccordionElements = Accordion['elements'];
export type AccordionOptions = Accordion['options'];
export type AccordionStates = Accordion['states'];
export type AccordionHelpers = Accordion['helpers'];
