import { ATTRS, DESCRIPTIONS, KBD, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createTabs',
	description: DESCRIPTIONS.BUILDER('tabs'),
	props: [
		{
			label: 'value',
			type: 'string',
			description: 'The initial value of the tabs.',
		},
		{
			label: 'onChange',
			type: '(value: string) => void',
			description: 'A callback function that is called when the tabs value changes.',
		},
		{
			label: 'activateOnFocus',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not to activate the tab when it is focused.',
		},
		{
			label: 'loop',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not to loop the tabs when navigating with the keyboard.',
		},
		{
			label: 'orientation',
			type: TYPES.ORIENTATION,
			default: '"horizontal"',
			description: 'The orientation of the tabs.',
		},
		{
			label: 'autoSet',
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
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-tabs',
			value: ATTRS.MELT('tabs'),
		},
	],
};

const list: APISchema = {
	title: 'list',
	description: 'The tabs list component.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-tabs-list',
			value: ATTRS.MELT('tab list'),
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which opens a given tab.',
	props: [
		{
			label: 'value',
			type: 'string',
			description: 'The value of the tab that this trigger opens.',
			required: true,
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the trigger is disabled.',
		},
	],
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.ACTIVE_INACTIVE,
		},
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED(),
		},
		{
			label: 'data-value',
			value: 'The value of the tab that this trigger opens.',
		},
		{
			label: 'data-melt-tabs-trigger',
			value: ATTRS.MELT('tab trigger'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The element that is opened when a given trigger is clicked.',
	dataAttributes: [
		{
			label: 'data-melt-tabs-content',
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

const schemas = {
	builder,
	root,
	list,
	trigger,
	content,
	keyboard,
};
const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Supports horizontal and vertical orientation',
];

export const tabsData = {
	schemas,
	features,
};
