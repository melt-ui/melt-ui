import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateCheckboxArgs',
	description: 'The configuration object passed to the `createCheckbox` builder function.',
	args: [
		{
			label: 'checked',
			type: 'boolean | "indeterminate"',
			default: false,
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
		{
			label: 'required',
			type: 'boolean',
			default: false,
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

const keyboard = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description: 'Toggles the checkbox state.',
		},
	],
};

export const schemas = {
	builder,
	keyboard,
};
