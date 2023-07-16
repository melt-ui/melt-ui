import type { createAccordion } from './create';

type BaseAccordionProps = {
	disabled?: boolean;
};

type SingleAccordionProps = {
	value?: string;
	type?: 'single';
};

type MultipleAccordionProps = {
	value?: string[];
	type: 'multiple';
};

export type CreateAccordionProps = BaseAccordionProps &
	(SingleAccordionProps | MultipleAccordionProps);

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
