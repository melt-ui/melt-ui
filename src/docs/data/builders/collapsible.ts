import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createCollapsible',
	description: DESCRIPTIONS.BUILDER('collapsible'),
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

const root: APISchema = {
	title: 'root',
	description: 'The root collapsible element.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED(),
		},
		{
			label: 'data-melt-collapsible',
			value: ATTRS.MELT('collapsible root'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The collapsible content element.',
	dataAttributes: [
		{
			label: 'data-melt-collapsible-content',
			value: ATTRS.MELT('collapsible content'),
		},
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-disabled',
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

const schemas = {
	builder,
	root,
	content,
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
