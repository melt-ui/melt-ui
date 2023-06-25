import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateToggleArgs',
	description: 'Configuration options for the `createTabs` builder.',
	args: [
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
		{
			label: 'pressed',
			type: 'boolean',
			default: false,
		},
	],
};

const toggle: APISchema = {
	title: 'Toggle',
	description: 'The toggle component.',
	dataAttributes: [
		{
			label: 'data-disabled',
			value: 'Present if the toggle is disabled.',
		},
		{
			label: 'data-state',
			value: ["'on'", "'off'"],
		},
	],
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description: 'Activates/deactivates the toggle.',
		},
		{
			key: 'Enter',
			description: 'Activates/deactivates the toggle.',
		},
	],
};

export const schemas = {
	builder,
	toggle,
	keyboard,
};
