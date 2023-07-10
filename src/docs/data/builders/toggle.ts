import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createToggle',
	description: DESCRIPTIONS.BUILDER('toggle'),
	props: [
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the toggle is disabled.',
		},
		{
			label: 'pressed',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the toggle is pressed.',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The root toggle component.',
	dataAttributes: [
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED('toggle'),
		},
		{
			label: 'data-state',
			value: ATTRS.ON_OFF,
		},
		{
			label: 'data-melt-toggle',
			value: ATTRS.MELT('toggle'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'Activates/deactivates the `toggle`.',
	},
	{
		key: KBD.ENTER,
		behavior: 'Activates/deactivates the `toggle`.',
	},
];

const schemas = {
	builder,
	root,
	keyboard,
};

const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];

export const toggleData = {
	schemas,
	features,
};
