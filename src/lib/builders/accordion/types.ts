import type { createAccordion } from './create';

type BaseAccordionArgs = {
	disabled?: boolean;
};

type SingleAccordionArgs = {
	value?: string;
	type?: 'single';
};

type MultipleAccordionArgs = {
	value?: string[];
	type: 'multiple';
};

export type CreateAccordionArgs = BaseAccordionArgs & (SingleAccordionArgs | MultipleAccordionArgs);

export type CreateAccordionReturn = ReturnType<typeof createAccordion>;
