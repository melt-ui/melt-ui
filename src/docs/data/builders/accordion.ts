import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createAccordion',
	description: 'The configuration object passed to the `createAccordion` builder function.',
	props: [
		{
			label: 'type',
			type: ["'single'", "'multiple'"],
			default: "'single'",
			description:
				'The type of accordion to create. A `"single"` accordion only allows one item to be open at a time. A `"multiple"` accordion allows multiple items to be open at a time.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the accordion is disabled.',
		},
		{
			label: 'value',
			type: ['string', 'string[]', 'undefined'],
			description:
				'The value of the currently open item. You can also pass an array of values to open multiple items at once if the accordion is of type `multiple`.',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'Contains all the parts of an accordion.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: "`'vertical' | 'horizontal'`",
		},
	],
};

const item: APISchema = {
	title: 'item',
	description: 'Contains all the parts of a collapsible section.',
	props: [
		{
			label: 'value',
			type: 'string',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
	dataAttributes: [
		{
			label: 'data-state',
			value: "`'open' | 'closed'`",
		},
		{
			label: 'data-disabled',
			value: '`true | undefined`',
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description:
		'Toggles the collapsed state of an item. It should be nested inside of its associated `item`.',
	props: [
		{
			label: 'type',
			type: ['"single"', '"multiple"'],
			default: "'single'",
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'value',
			type: ['string', 'string[]', 'undefined'],
		},
	],
	dataAttributes: [
		{
			label: 'data-melt-accordion-trigger',
			value: 'Present on all accordion triggers.',
		},
		{
			label: 'data-disabled',
			value: '`true | undefined`',
		},
		{
			label: 'data-value',
			value: 'The value of the associated item.',
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'Contains the collapsible content for an accordion item.',
	props: [
		{
			label: 'value',
			type: 'string',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
	dataAttributes: [
		{
			label: 'data-state',
			value: "`'open' | 'closed'`",
		},
		{
			label: 'data-disabled',
			value: '`"true" | undefined`',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Space',
		behavior: 'When the `trigger` of a collapsed section is focused, expands the section.',
	},
	{
		key: 'Enter',
		behavior: 'When the `trigger` of a collapsed section is focused, expands the section.',
	},
	{
		key: 'Tab',
		behavior: 'Moves focus to the next focusable element.',
	},
	{
		key: 'Shift + Tab',
		behavior: 'Moves focus to the previous focusable element',
	},
	{
		key: 'ArrowDown',
		behavior: 'Moves focus to the next `trigger` element.',
	},
	{
		key: 'ArrowUp',
		behavior: 'Moves focus to the previous `trigger` element.',
	},
	{
		key: 'Home',
		behavior: 'When focus is on a `trigger`, moves focus to the first `trigger`.',
	},
	{
		key: 'End',
		behavior: 'When focus is on a `trigger`, moves focus to the last `trigger`.',
	},
];

const schemas = {
	builder,
	content,
	root,
	item,
	trigger,
	keyboard,
};

const features = [
	'Full keyboard navigation',
	'Can expand one or multiple items',
	'Can be controlled or uncontrolled',
];

export const accordionData = {
	schemas,
	features,
};
