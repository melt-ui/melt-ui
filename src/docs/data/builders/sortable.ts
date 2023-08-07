import { ATTRS, KBD, PROPS, SEE } from '$docs/constants';
import type { KeyboardSchema } from '$docs/types';
import { builderSchema, elementSchema } from '$docs/utils';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'type',
		type: ["'single'", "'multiple'"],
		default: "'single'",
		description:
			'The type of sortable to create. A `"single"` sortable only allows one item to be open at a time. A `"multiple"` sortable allows multiple items to be open at a time.',
	},
	PROPS.DISABLED,
	PROPS.FORCE_VISIBLE,
];

const BUILDER_NAME = 'sortable';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createSortable',
	props: [
		...OPTION_PROPS,
		{
			name: 'multiple',
			type: 'boolean',
			default: 'false',
			description: 'If `true`, multiple sortable items can be open at the same time.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the sortable is disabled.',
		},
		{
			name: 'defaultValue',
			type: ['string', 'string[]', 'undefined'],
			description: 'The default value of the sortable.',
		},
		{
			name: 'value',
			type: 'Writable<string | string[] | undefined>',
			description:
				'A writable store that controls the value of the sortable. If provided, this will override the value passed to `defaultValue`.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<string | string[] | undefined>',
			description:
				'A callback called when the value of the `value` store should be changed. This is useful for controlling the value of the sortable from outside the sortable.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the sortable root.',
		},
		{
			name: 'item',
			description: 'The builder store used to create sortable items.',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create sortable triggers.',
		},
		{
			name: 'content',
			description: 'The builder store used to create sortable content.',
		},
		{
			name: 'heading',
			description: 'The builder store used to create sortable headings.',
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
	description: 'Contains all the parts of an sortable.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-sortable',
			value: ATTRS.MELT('sortable root'),
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
			name: 'data-melt-sortable-item',
			value: ATTRS.MELT('sortable item'),
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
			description: 'The value of the associated sortable item.',
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
			name: 'data-melt-sortable-trigger',
			value: ATTRS.MELT('sortable trigger'),
		},
	],
});

const content = elementSchema('content', {
	description: 'Contains the collapsible content for an sortable item.',
	props: [
		{
			name: 'value',
			type: 'string',
			description: 'The value of associated sortable item.',
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
			name: 'data-melt-sortable-content',
			value: ATTRS.MELT('sortable content'),
		},
	],
});

const heading = elementSchema('heading', {
	description:
		'The heading for an sortable item. It should be nested inside of its associated `item`.',
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
			name: 'data-melt-sortable-heading',
			value: ATTRS.MELT('sortable heading'),
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
	'Sort items within a zone or between zones',
	'Create dropzones',
	'Disable zones/items within zones',
];

export const sortableData: BuilderData = {
	schemas,
	features,
	keyboard,
};
