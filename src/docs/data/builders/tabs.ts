import { ATTRS, KBD, PROPS, SEE, TYPES } from '$docs/constants';
import type { KeyboardSchema } from '$docs/types';
import { builderSchema, elementSchema } from '$docs/utils';
import { tabsEvents } from '$lib/builders/tabs/events';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	PROPS.LOOP,
	{
		name: 'activateOnFocus',
		type: 'boolean',
		default: 'true',
		description: 'Whether or not to activate the tab when it is focused.',
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
];

const BUILDER_NAME = 'tabs';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createTabs',
	props: [
		...OPTION_PROPS,
		{
			name: 'defaultValue',
			type: 'string',
			description: 'The initial value of the tabs.',
		},
		{
			name: 'value',
			type: 'Writable<string>',
			description: 'A writable store that can be used to update the tabs value.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<string>',
			description: 'A callback that is called when the value of the tabs changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the root tabs element.',
		},
		{
			name: 'list',
			description: 'The builder store used to create the tabs list element.',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create a tabs trigger element.',
		},
		{
			name: 'content',
			description: 'The builder store used to create a tabs content element.',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Writable<string>',
			description: 'A writable store that represents the current value of the tabs.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
	description: 'The root tabs component.',
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
});

const list = elementSchema('list', {
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
});

const trigger = elementSchema('trigger', {
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
	events: tabsEvents['trigger'],
});

const content = elementSchema('content', {
	description: 'The element that is opened when a given trigger is clicked.',
	dataAttributes: [
		{
			name: 'data-melt-tabs-content',
			value: ATTRS.MELT('tab content'),
		},
	],
});

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
