import type { APISchema } from '$routes/(components)/api.svelte';

const builder: APISchema = {
	title: 'CreateAccordionArgs',
	description: 'The object you pass into the createAccordion builer function.',
	args: [
		{
			label: 'type',
			type: ["'single'", "'multiple'"],
			default: "'single'",
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
		{
			label: 'value',
			type: ['string', 'string[]', 'undefined'],
		},
	],
};

const root: APISchema = {
	title: 'Root',
	description: 'Contains all the parts of an accordion.',
	dataAttributes: [
		{
			label: '[data-orientation]',
			value: ['"vertical"', '"horizontal"'],
		},
	],
};

const item: APISchema = {
	title: 'Item',
	description: 'Contains all the parts of a collapsible section.',
	args: [
		{
			label: 'value',
			type: 'string',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
	],
	dataAttributes: [
		{
			label: '[data-state]',
			value: ['"open"', '"closed"'],
		},
		{
			label: '[data-disabled]',
			value: ['true', 'undefined'],
		},
	],
};

const trigger: APISchema = {
	title: 'Trigger',
	description:
		'Toggles the collapsed state of its associated item. It should be nested inside of an `item`.',
	args: [
		{
			label: 'type',
			type: ['"single"', '"multiple"'],
			default: "'single'",
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
		{
			label: 'value',
			type: ['string', 'string[]', 'undefined'],
		},
	],
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: ['trigger'],
		},
		{
			label: '[data-disabled]',
			value: ['true', 'undefined'],
		},
		{
			label: '[data-value]',
			value: 'The value of the associated item.',
		},
	],
};

const content: APISchema = {
	title: 'Content',
	description: 'Contains the collapsible content for an accordion item.',
	args: [
		{
			label: 'value',
			type: 'string',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
	],
	dataAttributes: [
		{
			label: '[data-state]',
			value: ['"open"', '"closed"'],
		},
		{
			label: '[data-disabled]',
			value: ['true', 'undefined'],
		},
	],
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description: 'When the `trigger` of a collapsed section is focused, expands the section.',
		},
		{
			key: 'Enter',
			description: 'When the `trigger` of a collapsed section is focused, expands the section.',
		},
		{
			key: 'Tab',
			description: 'Moves focus to the next focusable element.',
		},
		{
			key: 'Shift + Tab',
			description: 'Moves focus to the previous focusable element',
		},
		{
			key: 'ArrowDown',
			description: 'Moves focus to the next `trigger` element.',
		},
		{
			key: 'ArrowUp',
			description: 'Moves focus to the previous `trigger` element.',
		},
		{
			key: 'Home',
			description: 'When focus is on a `trigger`, moves focus to the first `trigger`.',
		},
		{
			key: 'End',
			description: 'When focus is on a `trigger`, moves focus to the last `trigger`.',
		},
	],
};

export const schemas = {
	builder,
	content,
	root,
	item,
	trigger,
	keyboard,
};
