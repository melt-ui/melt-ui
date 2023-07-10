import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createRadioGroup',
	description: DESCRIPTIONS.BUILDER('radio group'),
	props: [
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the radio group is disabled.',
		},
		{
			name: 'loop',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not the radio group should loop when navigating with the keyboard.',
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the radio group is required.',
		},
		{
			name: 'orientation',
			type: ['"horizontal"', '"vertical"'],
			default: '"vertical"',
			description: 'The orientation of the radio group.',
		},
		{
			name: 'value',
			type: 'string',
			description: 'The value of the checked radio item.',
		},
	],
};

const root: APISchema = {
	title: 'root',
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
};

const item: APISchema = {
	title: 'item',
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
};

const itemInput: APISchema = {
	title: 'itemInput',
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
};

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
