import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createToggle',
	description: DESCRIPTIONS.BUILDER('toggle'),
	props: [
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the toggle is disabled.',
		},
		{
			name: 'pressed',
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
			name: 'data-disabled',
			value: ATTRS.DISABLED('toggle'),
		},
		{
			name: 'data-state',
			value: ATTRS.ON_OFF,
		},
		{
			name: 'data-melt-toggle',
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

const schemas = [builder, root];

const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];

export const toggleData: BuilderData = {
	schemas,
	features,
	keyboard,
};
