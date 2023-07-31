import { ATTRS, KBD, PROPS, SEE } from '$docs/constants';
import type { KeyboardSchema } from '$docs/types';
import { builderSchema, elementSchema } from '$docs/utils/content';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	PROPS.DISABLED,
	PROPS.REQUIRED,
	PROPS.LOOP,
	{
		name: 'orientation',
		type: ['"horizontal"', '"vertical"'],
		default: '"vertical"',
		description: 'The orientation of the radio group.',
	},
];
const BUILDER_NAME = 'radio group';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createRadioGroup',
	props: [
		...OPTION_PROPS,
		{
			name: 'defaultValue',
			type: 'string',
			description: 'The value of the default checked radio item.',
		},
		{
			name: 'value',
			type: 'Writable<string>',
			description: 'A writable store that can be used to update the radio group value.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<string>',
			description: 'A callback that is called when the value of the radio group changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the radio group root.',
		},
		{
			name: 'item',
			description: 'The builder store used to create the radio group item.',
		},
		{
			name: 'itemInput',
			description: 'The builder store used to create the radio group item input.',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Readable<string>',
			description: 'A readable store with the current value of the radio group.',
		},
	],
	helpers: [
		{
			name: 'isChecked',
			type: 'Readable<(itemValue: string) => boolean>',
			description:
				'A derived store function that returns whether or not the radio item is checked.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
	description: 'The radio group component.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-radio-group',
			value: ATTRS.MELT('radio group'),
		},
	],
});

const item = elementSchema('item', {
	description: 'The radio group item components.',
	props: [
		{
			name: 'value',
			type: 'string',
			description: 'The value of the radio item.',
			required: true,
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the radio item is disabled.',
		},
	],
	dataAttributes: [
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('item'),
		},
		{
			name: 'data-value',
			value: 'The value of the radio item.',
		},
		{
			name: 'data-state',
			value: ATTRS.CHECKBOX_STATE,
		},
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-radio-group-item',
			value: ATTRS.MELT('radio group item'),
		},
	],
});

const itemInput = elementSchema('itemInput', {
	description: 'The hidden input element used for form submission.',
	props: [
		{
			name: 'value',
			type: 'string',
			description: 'The value of the radio item.',
			required: true,
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the radio item is disabled.',
		},
	],
});

const keyboard: KeyboardSchema = [
	{
		key: KBD.TAB,
		behavior: 'Moves focus to either the checked radio item or the first radio item.',
	},
	{
		key: KBD.SPACE,
		behavior: 'When focused on an unchecked item, checks it.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Moves focus to & checks the next radio item',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'Moves focus to & checks the next radio item',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'Moves focus to & checks the previous radio item',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior: 'Moves focus to & checks the previous radio item',
	},
];

const schemas = [builder, root, item, itemInput];

const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Supports horizontal and vertical orientation',
];

export const radioGroupData: BuilderData = {
	schemas,
	features,
	keyboard,
};
