import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createCheckbox',
	description: 'The configuration object passed to the `createCheckbox` builder function.',
	props: [
		{
			label: 'checked',
			type: ['boolean', '"indeterminate"'],
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

const keyboard: KeyboardSchema = [
	{
		key: 'Space',
		behavior: 'Toggles the checkbox state.',
	},
];

const schemas = {
	builder,
	keyboard,
};

const features = [
	'Supports indeterminate state',
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
];

export const checkboxData = {
	schemas,
	features,
};
