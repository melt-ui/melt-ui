import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createToggle',
	description: 'The configuration object passed to the `createToggle` builder function.',
	props: [
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'pressed',
			type: 'boolean',
			default: 'false',
		},
	],
};

const toggle: APISchema = {
	title: 'toggle',
	description: 'The toggle component.',
	dataAttributes: [
		{
			label: 'data-disabled',
			value: 'Present if the toggle is disabled.',
		},
		{
			label: 'data-state',
			value: "`'on' | 'off'`",
		},
		{
			label: 'data-melt-toggle',
			value: 'Present on the toggle element.',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Space',
		behavior: 'Activates/deactivates the toggle.',
	},
	{
		key: 'Enter',
		behavior: 'Activates/deactivates the toggle.',
	},
];

const schemas = {
	builder,
	toggle,
	keyboard,
};

const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];

export const toggleData = {
	schemas,
	features,
};
