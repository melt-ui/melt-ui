import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateSwitchArgs',
	description: 'The configuration object passed to the `createSwitch` builder function.',
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

const root: APISchema = {
	title: 'Root',
	description: 'The switch component.',
	dataAttributes: [
		{
			label: 'data-disabled',
			value: 'Present if the switch is disabled.',
		},
		{
			label: 'data-state',
			value: ['"checked"', '"unchecked"'],
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
	root,
};
