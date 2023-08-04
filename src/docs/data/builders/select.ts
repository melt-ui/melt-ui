import { ATTRS, DESCRIPTIONS, KBD, PROPS, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { selectEvents } from '$lib/builders/select/events.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	PROPS.REQUIRED,
	PROPS.DISABLED,
	PROPS.ARROW_SIZE,
	PROPS.PREVENT_SCROLL,
	PROPS.LOOP,
	PROPS.CLOSE_ON_ESCAPE,
	PROPS.CLOSE_ON_OUTSIDE_CLICK,
	PROPS.PORTAL,
	PROPS.FORCE_VISIBLE,
	PROPS.POSITIONING({ default: "placement: 'bottom'" }),
	{
		name: 'defaultValueLabel',
		type: 'string',
		description: 'The initial default value label of the select.',
	},
	{
		name: 'name',
		type: 'string',
		description: 'The name to be used for the select input.',
	},
];

const BUILDER_NAME = 'select';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createSelect',
	props: [
		...OPTION_PROPS,

		{
			name: 'name',
			type: 'string',
			description: 'The name of the select.',
		},
		{
			name: 'preventScroll',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.PREVENT_SCROLL('select'),
		},
		{
			name: 'loop',
			type: 'boolean',
			default: 'false',
			description: DESCRIPTIONS.LOOP,
		},
		{
			name: 'multiple',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the select is a multiple select.',
		},
		{
			name: 'defaultValue',
			type: 'unknown',
			description: 'The initial value of the select.',
		},
		{
			name: 'value',
			type: 'Writable<unknown>',
			description: 'A writable store that can be used to get or update or the select value.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<unknown>',
			description: 'A callback that is called when the value of the select changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
		PROPS.DEFAULT_OPEN,
		PROPS.OPEN,
		PROPS.ON_OPEN_CHANGE,
	],
	elements: [
		{
			name: 'trigger',
			description: 'The builder store used to create the select trigger.',
		},
		{
			name: 'menu',
			description: 'The builder store used to create the select menu.',
		},
		{
			name: 'option',
			description: 'The builder store used to create the select options.',
		},
		{
			name: 'input',
			description: 'The builder store used to create the select input.',
		},
		{
			name: 'label',
			description: 'The builder store used to create the select label.',
		},
		{
			name: 'separator',
			description: 'The builder store used to create the select separator.',
		},
		{
			name: 'group',
			description: 'The builder store used to create the select group.',
		},
		{
			name: 'groupLabel',
			description: 'The builder store used to create the select group label.',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the select arrow.',
		},
	],
	states: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store that returns whether or not the select is open.',
		},
		{
			name: 'value',
			type: 'Writable<unknown>',
			description: 'A writable store that returns the current value of the select.',
		},
	],
	helpers: [
		{
			name: 'isSelected',
			type: 'Readable<(value: unknown) => boolean>',
			description: 'A derived store that returns whether or not the given value is selected.',
		},
	],
	options: OPTION_PROPS,
});

const trigger = elementSchema('trigger', {
	description: 'The element which opens/closes the select.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('select'),
		},
		{
			name: 'data-melt-select-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
	events: selectEvents['trigger'],
});

const menu = elementSchema('menu', {
	description: 'The menu element',
	dataAttributes: [
		{
			name: 'data-melt-select-menu',
			value: ATTRS.MELT('menu'),
		},
	],
	events: selectEvents['menu'],
});

const option = elementSchema('option', {
	description: 'The option elements',
	props: [
		{
			name: 'label',
			type: 'string',
			description: 'The label of the option.',
		},
		{
			name: 'value',
			type: 'unknown',
			description: 'The value of the option.',
			required: true,
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the option is disabled.',
		},
	],
	dataAttributes: [
		{
			name: 'data-melt-select-option',
			value: ATTRS.MELT('option'),
		},
	],
	events: selectEvents['option'],
});

const input = elementSchema('input', {
	description: 'The hidden input element. Used for form submission.',
	dataAttributes: [
		{
			name: 'data-melt-select-input',
			value: ATTRS.MELT('input'),
		},
	],
});

const label = elementSchema('label', {
	description: 'The label element',
	dataAttributes: [
		{
			name: 'data-melt-select-label',
			value: ATTRS.MELT('label'),
		},
	],
	events: selectEvents['label'],
});

const arrow = elementSchema('arrow', {
	description: 'The optional arrow element',
	dataAttributes: [
		{
			name: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			name: 'data-melt-select-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
});

const separator = elementSchema('separator', {
	description: 'An optional separator element',
	dataAttributes: [
		{
			name: 'data-melt-select-separator',
			value: ATTRS.MELT('separator'),
		},
	],
});

const group = elementSchema('group', {
	description: 'A function which takes in a unique key to group options together.',
	props: [
		{
			name: 'key',
			type: 'string',
			description: 'A unique key for the group.',
		},
	],
	dataAttributes: [
		{
			name: 'data-melt-select-group',
			value: ATTRS.MELT('group'),
		},
	],
});

const groupLabel = elementSchema('groupLabel', {
	description: 'A function which takes in a unique key to group options together.',
	props: [
		{
			name: 'key',
			type: 'string',
			description: 'A unique key for the group.',
		},
	],
	dataAttributes: [
		{
			name: 'data-melt-select-group-label',
			value: ATTRS.MELT('group-label'),
		},
	],
});

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior:
			'When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option.',
	},
	{
		key: KBD.ENTER,
		behavior:
			'When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior:
			'When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the next option.',
	},
	{
		key: KBD.ARROW_UP,
		behavior:
			'When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the previous option.',
	},
	{
		key: KBD.ESCAPE,
		behavior: 'Closes the select and moves focus to the `trigger`.',
	},
];

const schemas = [builder, trigger, label, menu, option, group, groupLabel, input, separator, arrow];

const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Typeahead support',
	'Optional arrow component',
	'Custom positioning',
];

export const selectData: BuilderData = {
	schemas,
	features,
	keyboard,
};
