import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createTabs',
	description: 'The configuration object passed to the `createTabs` builder function.',
	props: [
		{
			label: 'value',
			type: 'string',
		},
		{
			label: 'onChange',
			type: '(value: string) => void',
		},
		{
			label: 'activateOnFocus',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'loop',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'orientation',
			type: ['"horizontal"', '"vertical"'],
			default: '"horizontal"',
		},
		{
			label: 'autoSet',
			type: 'boolean',
			default: 'true',
		},
	],
};

const root: APISchema = {
	title: 'tabs',
	description: 'The tabs component.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: "`'horizontal' | 'vertical'`",
		},
		{
			label: 'data-melt-tabs',
			value: 'Present on the tabs element',
		},
	],
};

const list: APISchema = {
	title: 'list',
	description: 'The tabs list component.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: "`'horizontal' | 'vertical'`",
		},
		{
			label: 'data-melt-tabs-list',
			value: 'Present on the tabs list element',
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
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
	dataAttributes: [
		{
			label: 'data-state',
			value: "`'active' | 'inactive'`",
		},
		{
			label: 'data-orientation',
			value: "`'horizontal' | 'vertical'`",
		},
		{
			label: 'data-disabled',
			value: 'Present if disabled',
		},
		{
			label: 'data-melt-tabs-trigger',
			value: 'Present on the trigger element',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Tab',
		behavior:
			'When focus moves onto the tabs, focuses the active trigger. When a trigger is focused, moves focus to the active content.',
	},
	{
		key: 'ArrowDown',
		behavior:
			'Moves focus to the next trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: 'ArrowRight',
		behavior:
			'Moves focus to the next trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: 'ArrowUp',
		behavior:
			'Moves focus to the preview trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: 'ArrowLeft',
		behavior:
			'Moves focus to the preview trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: 'Home',
		behavior:
			'Moves focus to the first trigger depending on `orientation` & activates the corresponding content.',
	},
	{
		key: 'End',
		behavior:
			'Moves focus to the last trigger depending on `orientation` & activates the corresponding content.',
	},
];

const schemas = {
	builder,
	tabs: root,
	list,
	trigger,
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
