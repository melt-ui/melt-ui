import { ATTRS, DESCRIPTIONS, KBD, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createTabs',
	description: DESCRIPTIONS.BUILDER('tabs'),
	props: [
		{
			name: 'value',
			type: 'string',
			description: 'The initial value of the tabs.',
		},
		{
			name: 'onChange',
			type: '(value: string) => void',
			description: 'A callback function that is called when the tabs value changes.',
		},
		{
			name: 'activateOnFocus',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not to activate the tab when it is focused.',
		},
		{
			name: 'loop',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not to loop the tabs when navigating with the keyboard.',
		},
		{
			name: 'orientation',
			type: TYPES.ORIENTATION,
			default: '"horizontal"',
			description: 'The orientation of the tabs.',
		},
		{
			name: 'autoSet',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not to automatically set the tabs value when a trigger is clicked.',
		},
	],
};

const root: APISchema = {
	title: 'tabs',
	description: 'The tabs component.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-tabs',
			value: ATTRS.MELT('tabs'),
		},
	],
};

const list: APISchema = {
	title: 'list',
	description: 'The tabs list component.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-tabs-list',
			value: ATTRS.MELT('tab list'),
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which opens a given tab.',
	props: [
		{
			name: 'value',
			type: 'string',
			description: 'The value of the tab that this trigger opens.',
			required: true,
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the trigger is disabled.',
		},
	],
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.ACTIVE_INACTIVE,
		},
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED(),
		},
		{
			name: 'data-value',
			value: 'The value of the tab that this trigger opens.',
		},
		{
			name: 'data-melt-tabs-trigger',
			value: ATTRS.MELT('tab trigger'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The element that is opened when a given trigger is clicked.',
	dataAttributes: [
		{
			name: 'data-melt-tabs-content',
			value: ATTRS.MELT('tab content'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.TAB,
		behavior:
			'When focus moves onto the tabs, focuses the active trigger. When a trigger is focused, moves focus to the active content.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior:
			'Moves focus to the next trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior:
			'Moves focus to the next trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: KBD.ARROW_UP,
		behavior:
			'Moves focus to the preview trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior:
			'Moves focus to the preview trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: KBD.HOME,
		behavior:
			'Moves focus to the first trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: KBD.END,
		behavior:
			'Moves focus to the last trigger depending on `orientation` & activates the corresponding content.',
	},
];

const schemas = [builder, root, list, trigger, content];
const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Supports horizontal and vertical orientation',
];

export const tabsData: BuilderData = {
	schemas,
	features,
	keyboard,
};
