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

export type CreateAccordionReturn = ReturnType<typeof createAccordion>;
