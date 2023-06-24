import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateSwitchArgs',
	description: 'The object you pass into createAccordion. Optional.',
	args: [
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

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description: 'When the switch has focus, toggles the switch.',
		},
		{
			key: 'Enter',
			description: 'When the switch has focus, toggles the switch.',
		},
	],
};

export const schemas = {
	builder,
	keyboard,
};
