import { ATTRS, KBD, PROPS, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { accordionEvents } from '$lib/builders/accordion/events.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'type',
		type: ["'single'", "'multiple'"],
		default: "'single'",
		description:
			'The type of accordion to create. A `"single"` accordion only allows one item to be open at a time. A `"multiple"` accordion allows multiple items to be open at a time.',
	},
	PROPS.DISABLED,
	PROPS.FORCE_VISIBLE,
];

const BUILDER_NAME = 'accordion';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createAccordion',
	props: [
		...OPTION_PROPS,
		{
			name: 'multiple',
			type: 'boolean',
			default: 'false',
			description: 'If `true`, multiple accordion items can be open at the same time.',
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
		{
			name: 'ids',
			type: 'Record<"root", string>',
			description: 'Override the internally generated ids for the elements.',
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the accordion root.',
		},
		{
			name: 'item',
			description: 'The builder store used to create accordion items.',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create accordion triggers.',
		},
		{
			name: 'content',
			description: 'The builder store used to create accordion content.',
		},
		{
			name: 'heading',
			description: 'The builder store used to create accordion headings.',
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
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
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
});

const item = elementSchema('item', {
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
});

const trigger = elementSchema('trigger', {
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
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-accordion-trigger',
			value: ATTRS.MELT('accordion trigger'),
		},
	],
	events: accordionEvents['trigger'],
});

const content = elementSchema('content', {
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
});

const heading = elementSchema('heading', {
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
});

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
