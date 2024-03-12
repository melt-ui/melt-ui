import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { createAccordion } from './create.js';
export type { AccordionComponentEvents } from './events.js';

export type CreateAccordionProps = {
	/**
	 * If `true`, multiple accordion items can be open at the same time.
	 *
	 * @default false
	 */
	multiple?: ReadableProp<boolean>;

	/**
	 * When `true`, prevents the user from interacting with the accordion.
	 *
	 * @default false
	 */
	disabled?: ReadableProp<boolean>;

	/**
	 * Whether the accordion content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: ReadableProp<boolean>;

	/**
	 * The value of the accordion. If `multiple` is `true`, this should be an array of strings.
	 * Otherwise, it should be a string.
	 *
	 * @default undefined
	 */
	value?: ReadableProp<string[]>;
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
export type AccordionElements = BuilderReturn<typeof createAccordion>['elements'];
export type AccordionOptions = BuilderReturn<typeof createAccordion>['options'];
export type AccordionStates = BuilderReturn<typeof createAccordion>['states'];
