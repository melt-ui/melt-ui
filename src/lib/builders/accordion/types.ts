import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { BuilderReturn, WhenTrue } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createAccordion } from './create.js';
export type { AccordionComponentEvents } from './events.js';

type AccordionValue<Multiple extends boolean> = WhenTrue<Multiple, string[], string>;

export type CreateAccordionProps<Multiple extends boolean = false> = {
	/**
	 * If `true`, multiple accordion items can be open at the same time.
	 *
	 * @default false
	 */
	multiple?: Multiple;

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
	defaultValue?: AccordionValue<Multiple>;

	/**
	 * The controlled value store for the accordion.
	 * If provided, this will override the value passed to `defaultValue`.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	value?: Writable<AccordionValue<Multiple> | undefined>;

	/**
	 * A callback called when the value of the `value` store should be changed.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<AccordionValue<Multiple> | undefined>;
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

export type Accordion<Multiple extends boolean = false> = BuilderReturn<
	typeof createAccordion<Multiple>
>;
export type AccordionElements<Multiple extends boolean = false> = BuilderReturn<
	typeof createAccordion<Multiple>
>['elements'];
export type AccordionOptions<Multiple extends boolean = false> = BuilderReturn<
	typeof createAccordion<Multiple>
>['options'];
export type AccordionStates<Multiple extends boolean = false> = BuilderReturn<
	typeof createAccordion<Multiple>
>['states'];
export type AccordionHelpers<Multiple extends boolean = false> = BuilderReturn<
	typeof createAccordion<Multiple>
>['helpers'];
