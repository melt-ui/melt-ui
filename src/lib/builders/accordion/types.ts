import type { Writable } from 'svelte/store';
import type { createAccordion } from './create';
import type { ChangeFn } from '@melt-ui/svelte/internal/helpers';

type BaseAccordionProps = {
	disabled?: boolean;
};

type SingleAccordionProps = {
	/**
	 * The controlled value store for the accordion. If this is not provided,
	 * the accordion will be uncontrolled and will manage its own state. For
	 * additional control, you can provide an `onValueChange` callback to override
	 * the default behavior.
	 */
	value?: Writable<string>;

	/**
	 * The value of the item that should be open by default. This should only be used
	 * when the accordion is uncontrolled.
	 */
	defaultValue?: string;

	/**
	 * The type of accordion. If `single`, only one item can be open at a time. If `multiple`,
	 * multiple items can be open at a time.
	 */
	type?: 'single';

	/**
	 * The callback function called when the value changes. This should only be used when the
	 * accordion is controlled and you want to override the default behavior.
	 */
	onValueChange?: ChangeFn<string>;
};

type MultipleAccordionProps = {
	/**
	 * The controlled value store for the accordion. If this is not provided,
	 * the accordion will be uncontrolled and will manage its own state. For
	 * additional control, you can provide an `onValueChange` callback to override
	 * the default behavior.
	 */
	value?: Writable<string>;

	/**
	 * The value(s) of the item(s) that should be open by default. This should only be used
	 * when the accordion is uncontrolled.
	 */
	defaultValue?: string[];

	/**
	 * The type of accordion. If `single`, only one item can be open at a time. If `multiple`,
	 * multiple items can be open at a time.
	 */
	type: 'multiple';

	/**
	 * The callback function called when the value changes. This should only be used when the
	 * accordion is controlled and you want to override the default behavior.
	 */
	onValueChange?: ChangeFn<string[]>;
};

export type CreateAccordionProps = BaseAccordionProps &
	(SingleAccordionProps | MultipleAccordionProps);

export type AccordionItemProps =
	| {
			value: string;
			disabled?: boolean;
	  }
	| string;

export type CreateAccordionReturn = ReturnType<typeof createAccordion>;
