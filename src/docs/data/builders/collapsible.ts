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
	returnedProps: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store that controls the open state of the collapsible.',
		},
		{
			name: 'disabled',
			type: 'Writable<boolean>',
			description: 'A writable store that controls whether or not the collapsible is disabled.',
		},
		{
			name: 'root',
			description: 'The builder store used to create the collapsible root.',
			link: '#root',
		},
		{
			name: 'content',
			description: 'The builder store used to create the collapsible content.',
			link: '#content',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create the collapsible trigger.',
			link: '#trigger',
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

const trigger: APISchema = {
	title: 'trigger',
	description: 'The collapsible trigger element.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('trigger'),
		},
		{
			name: 'data-melt-collapsible-trigger',
			value: ATTRS.MELT('collapsible trigger'),
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

const schemas = [builder, root, trigger, content];

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
