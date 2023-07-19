import type {
	BuilderElements,
	BuilderHelpers,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
import type { createAccordion } from './create';

export type AccordionType = 'single' | 'multiple';

export type CreateAccordionProps<T extends AccordionType = 'single'> = {
	value?: T extends 'single' ? string : string[];
	type?: T;
	disabled?: boolean;
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
export type AccordionElements = BuilderElements<Accordion>;
export type AccordionOptions = BuilderOptions<Accordion>;
export type AccordionStates = BuilderStates<Accordion>;
export type AccordionHelpers = BuilderHelpers<Accordion>;
