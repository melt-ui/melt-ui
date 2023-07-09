import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'CreateCollapsibleArgs',
	description: 'The configuration object passed to the `createCollapsible` builder function.',
	props: [
		{
			label: 'open',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Space',
		behavior: 'Activates the trigger and toggles the visibility of the collapsible content',
	},
	{
		key: 'Enter',
		behavior: 'Activates the trigger and toggles the visibility of the collapsible content',
	},
];

const schemas = {
	builder,
	keyboard,
};

const features = [
	'Full keyboard navigation',
	'Svelte transition support',
	'Can be controlled or uncontrolled',
];

export const collapsibleData = {
	schemas,
	features,
};
