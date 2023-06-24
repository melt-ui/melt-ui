import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateCollapsibleArgs',
	description: 'The object you pass into createCollapsible. Optional.',
	args: [
		{
			label: 'open',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
	],
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description: 'Activates the trigger and toggles the visibility of the collapsible content',
		},
		{
			key: 'Enter',
			description: 'Activates the trigger and toggles the visibility of the collapsible content',
		},
	],
};

export const schemas = {
	builder,
	keyboard,
};
