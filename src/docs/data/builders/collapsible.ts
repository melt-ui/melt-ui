import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createCollapsible',
	description: DESCRIPTIONS.BUILDER('collapsible'),
	props: [
		{
			name: 'open',
			type: 'boolean',
			default: 'false',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The root collapsible element.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED(),
		},
		{
			name: 'data-melt-collapsible',
			value: ATTRS.MELT('collapsible root'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The collapsible content element.',
	dataAttributes: [
		{
			name: 'data-melt-collapsible-content',
			value: ATTRS.MELT('collapsible content'),
		},
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED(),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'Activates the trigger and toggles the visibility of the collapsible content',
	},
	{
		key: KBD.ENTER,
		behavior: 'Activates the trigger and toggles the visibility of the collapsible content',
	},
];

const schemas = [builder, root, content];

const features = [
	'Full keyboard navigation',
	'Svelte transition support',
	'Can be controlled or uncontrolled',
];

export const collapsibleData: BuilderData = {
	schemas,
	features,
	keyboard,
};
