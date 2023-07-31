import { ATTRS, KBD, PROPS } from '$docs/constants';
import type { KeyboardSchema } from '$docs/types';
import { builderSchema, elementSchema, genProps } from '$docs/utils/content';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [PROPS.DISABLED, PROPS.FORCE_VISIBLE];

const builder = builderSchema('collapsible', {
	title: 'createCollapsible',
	props: genProps('collapsible', [
		...OPTION_PROPS,
		PROPS.DEFAULT_OPEN,
		PROPS.OPEN,
		PROPS.ON_OPEN_CHANGE,
	]),
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the collapsible root.',
		},
		{
			name: 'content',
			description: 'The builder store used to create the collapsible content.',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create the collapsible trigger.',
		},
	],
	states: [
		{
			name: 'open',
			type: 'Readable<boolean>',
			description: 'A readable store with the current open state of the collapsible.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
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
});

const trigger = elementSchema('trigger', {
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
});

const content = elementSchema('content', {
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
});

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
