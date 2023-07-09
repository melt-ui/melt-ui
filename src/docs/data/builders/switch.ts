import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createSwitch',
	description: 'The configuration object passed to the `createSwitch` builder function.',
	props: [
		{
			label: 'checked',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'required',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'name',
			type: 'string',
		},
		{
			label: 'value',
			type: 'string',
		},
	],
};

const root: APISchema = {
	title: 'switch',
	description: 'The switch element.',
	dataAttributes: [
		{
			label: 'data-disabled',
			value: 'Present if the switch is disabled.',
		},
		{
			label: 'data-state',
			value: "`'checked' | 'unchecked'`",
		},
		{
			label: 'data-melt-switch',
			value: 'Present on the switch element.',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Space',
		behavior: 'When the switch has focus, toggles the switch.',
	},
	{
		key: 'Enter',
		behavior: 'When the switch has focus, toggles the switch.',
	},
];

const schemas = {
	builder,
	keyboard,
	switch: root,
};
const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];

export const switchData = {
	schemas,
	features,
};
