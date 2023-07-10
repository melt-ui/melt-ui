import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createSwitch',
	description: DESCRIPTIONS.BUILDER('switch'),
	props: [
		{
			name: 'checked',
			type: 'boolean',
			default: 'false',
			description: 'The initial checked state of the switch.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the switch is disabled.',
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the switch is required.',
		},
		{
			name: 'name',
			type: 'string',
			description: 'The name of the hidden input element used for form submission..',
		},
		{
			name: 'value',
			type: 'string',
			description: 'The value of the hidden input element used for form submission.',
		},
	],
};

const root: APISchema = {
	title: 'switch',
	description: 'The switch element.',
	dataAttributes: [
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('switch'),
		},
		{
			name: 'data-state',
			value: ATTRS.CHECKED_UNCHECKED,
		},
		{
			name: 'data-melt-switch',
			value: ATTRS.MELT('switch'),
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The hidden input element used for form submission.',
	dataAttributes: [
		{
			name: 'data-melt-switch-input',
			value: ATTRS.MELT('input'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'When the switch has focus, toggles the switch.',
	},
	{
		key: KBD.ENTER,
		behavior: 'When the switch has focus, toggles the switch.',
	},
];

const schemas = [builder, root, input];
const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];

export const switchData: BuilderData = {
	schemas,
	features,
	keyboard,
};
