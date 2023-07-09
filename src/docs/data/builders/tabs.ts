import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'CreateTabsArgs',
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
	title: 'Root',
	description: 'The tabs component.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ['"horizontal"', '"vertical"'],
		},
		{
			label: 'data-melt-part',
			value: '`tabs-root`',
		},
	],
};

const list: APISchema = {
	title: 'List',
	description: 'The tabs list component.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ['"horizontal"', '"vertical"'],
		},
	],
};

const trigger: APISchema = {
	title: 'Trigger',
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
			value: ['"active"', '"inactive"'],
		},
		{
			label: 'data-orientation',
			value: ['"horizontal"', '"vertical"'],
		},
		{
			label: 'data-disabled',
			value: 'Present if disabled',
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
		behavior: 'Moves focus to the first trigger depending & activates the corresponding content.',
	},
	{
		key: 'End',
		behavior: 'Moves focus to the last trigger depending & activates the corresponding content.',
	},
];

const schemas = {
	builder,
	root,
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
