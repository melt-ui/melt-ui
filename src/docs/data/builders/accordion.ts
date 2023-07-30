import { ATTRS, DESCRIPTIONS, KBD, SEE } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createAccordion',
	description: DESCRIPTIONS.BUILDER('accordion'),
	props: [
		{
			name: 'type',
			type: ["'single'", "'multiple'"],
			default: "'single'",
			description:
				'The type of accordion to create. A `"single"` accordion only allows one item to be open at a time. A `"multiple"` accordion allows multiple items to be open at a time.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the accordion is disabled.',
		},
		{
			name: 'defaultValue',
			type: ['string', 'string[]', 'undefined'],
			description: 'The default value of the accordion.',
		},
		{
			name: 'value',
			type: 'Writable<string | string[] | undefined>',
			description:
				'A writable store that controls the value of the accordion. If provided, this will override the value passed to `defaultValue`.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<string | string[] | undefined>',
			description:
				'A callback called when the value of the `value` store should be changed. This is useful for controlling the value of the accordion from outside the accordion.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the accordion root.',
			link: '#root',
		},
		{
			name: 'item',
			description: 'The builder store used to create accordion items.',
			link: '#item',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create accordion triggers.',
			link: '#trigger',
		},
		{
			name: 'content',
			description: 'The builder store used to create accordion content.',
			link: '#content',
		},
		{
			name: 'heading',
			description: 'The builder store used to create accordion headings.',
			link: '#heading',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Writable<string | string[] | undefined>',
			description: 'A writable store with the value of the currently open item.',
		},
	],
	helpers: [
		{
			name: 'isSelected',
			type: 'Readable<(key: string) => boolean>',
			description:
				'A derived store that takes an item ID as an argument and returns whether or not the item is selected.',
		},
	],
	options: [
		{
			name: 'type',
			type: 'Writable<"single" | "multiple">',
			description:
				'The type of accordion to create. A `"single"` accordion only allows one item to be open at a time. A `"multiple"` accordion allows multiple items to be open at a time.',
		},
		{
			name: 'disabled',
			type: 'Writable<boolean>',
			description: 'Whether or not the accordion is disabled.',
		},
		{
			name: 'forceVisible',
			type: 'Writable<boolean>',
			description:
				'Whether or not the accordion is forced to be visible. This is useful for custom transitions as it prevents the accordion from being hidden while the transition is in progress.',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'Contains all the parts of an accordion.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-accordion',
			value: ATTRS.MELT('accordion root'),
		},
	],
};

const item: APISchema = {
	title: 'item',
	description: 'Contains all the parts of a collapsible section.',
	props: [
		{
			name: 'value',
			type: 'string',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('item'),
		},
		{
			name: 'data-melt-accordion-item',
			value: ATTRS.MELT('accordion item'),
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description:
		'Toggles the collapsed state of an item. It should be nested inside of its associated `item`.',
	props: [
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the trigger is disabled.',
		},
		{
			name: 'value',
			type: ['string', 'string[]', 'undefined'],
			description: 'The value of the associated accordion item.',
		},
	],
	dataAttributes: [
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('trigger'),
		},
		{
			name: 'data-value',
			value: 'The value of the associated item.',
		},
		{
			name: 'data-melt-accordion-trigger',
			value: ATTRS.MELT('accordion trigger'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'Contains the collapsible content for an accordion item.',
	props: [
		{
			name: 'value',
			type: 'string',
			description: 'The value of associated accordion item.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the content is disabled.',
		},
	],
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('content'),
		},
		{
			name: 'data-value',
			value: 'The value of the associated item',
		},
		{
			name: 'data-melt-accordion-content',
			value: ATTRS.MELT('accordion content'),
		},
	],
};

const heading: APISchema = {
	title: 'heading',
	description:
		'The heading for an accordion item. It should be nested inside of its associated `item`.',
	props: [
		{
			name: 'level',
			type: ['1', '2', '3', '4', '5', '6'],
			description: 'The heading level to use for the element.',
		},
	],
	dataAttributes: [
		{
			name: 'data-heading-level',
			value: 'The heading level applied to the element.',
		},
		{
			name: 'data-melt-accordion-heading',
			value: ATTRS.MELT('accordion heading'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'When the `trigger` of a collapsed section is focused, expands the section.',
	},
	{
		key: KBD.ENTER,
		behavior: 'When the `trigger` of a collapsed section is focused, expands the section.',
	},
	{
		key: KBD.TAB,
		behavior: 'Moves focus to the next focusable element.',
	},
	{
		key: KBD.SHIFT_TAB,
		behavior: 'Moves focus to the previous focusable element',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Moves focus to the next `trigger` element.',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'Moves focus to the previous `trigger` element.',
	},
	{
		key: KBD.HOME,
		behavior: 'When focus is on a `trigger`, moves focus to the first `trigger`.',
	},
	{
		key: KBD.END,
		behavior: 'When focus is on a `trigger`, moves focus to the last `trigger`.',
	},
];

const schemas: BuilderData['schemas'] = [builder, root, trigger, item, content, heading];

const features: BuilderData['features'] = [
	'Full keyboard navigation',
	'Can expand one or multiple items',
	'Can be controlled or uncontrolled',
];

export const accordionData: BuilderData = {
	schemas,
	features,
	keyboard,
};
