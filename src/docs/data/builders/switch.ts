import { ATTRS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createSwitch',
	description: 'The builder function used to create a switch component.',
	props: [
		{
			label: 'checked',
			type: 'boolean',
			default: 'false',
			description: 'The initial checked state of the switch.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the switch is disabled.',
		},
		{
			label: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the switch is required.',
		},
		{
			label: 'name',
			type: 'string',
			description: 'The name of the hidden input element used for form submission..',
		},
		{
			label: 'value',
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
			label: 'data-disabled',
			value: ATTRS.DISABLED('switch'),
		},
		{
			label: 'data-state',
			value: ATTRS.CHECKED_UNCHECKED,
		},
		{
			label: 'data-melt-switch',
			value: ATTRS.MELT('switch'),
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The hidden input element used for form submission.',
	dataAttributes: [
		{
			label: 'data-melt-switch-input',
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

const schemas = {
	builder,
	keyboard,
	root,
	input,
};
const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];

export const switchData = {
	schemas,
	features,
};
