import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'CreateToolbarArgs',
	description: 'The configuration object passed to the `createToolbar` builder function.',
	props: [
		{
			label: 'loop',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'orientation',
			type: ["'horizontal'", "'vertical'"],
		},
	],
};

const root: APISchema = {
	title: 'Root',
	description: 'The root toolbar element.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ["'horizontal'", "'vertical'"],
		},
		{
			label: 'data-melt-toolbar',
			value: '',
		},
	],
};

const button: APISchema = {
	title: 'Button',
	description: 'The toolbar button element.',
	dataAttributes: [
		{
			label: 'data-melt-toolbar-item',
			value: '',
		},
	],
};

const link: APISchema = {
	title: 'Link',
	description: 'The toolbar link element.',
	dataAttributes: [
		{
			label: 'data-melt-toolbar-item',
			value: '',
		},
	],
};

const separator: APISchema = {
	title: 'Separator',
	description: 'The toolbar separator element.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ["'horizontal'", "'vertical'"],
		},
		{
			label: 'data-melt-toolbar-separator',
			value: '',
		},
	],
};

const groupBuilder: APISchema = {
	title: 'CreateToolbarGroupArgs',
	description: 'Configuration options for the `createToolbarGroup` builder.',
	props: [
		{
			label: 'type',
			type: ["'single'", "'multiple'"],
			default: "'single'",
		},
		{
			label: 'value',
			type: ['string', 'string[]', 'null'],
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
};

const groupRoot: APISchema = {
	title: 'Group Root',
	description: 'The root toolbar element for a toolbar group.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ["'horizontal'", "'vertical'"],
		},
		{
			label: 'data-melt-toolbar-group',
			value: '',
		},
	],
};

const groupItem: APISchema = {
	title: 'Group Item',
	description: 'A an item within a toolbar group.',
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
			label: 'data-orientation',
			value: ["'horizontal'", "'vertical'"],
		},
		{
			label: 'data-melt-toolbar-item',
			value: '',
		},
		{
			label: 'data-disabled',
			value: 'Present if the item is disabled.',
		},
		{
			label: 'data-state',
			value: ["'on'", "'off'"],
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Tab',
		behavior: 'Moves focus to the first item in the group.',
	},
	{
		key: 'Space',
		behavior: 'Toggles the state of the focused item.',
	},
	{
		key: 'Enter',
		behavior: 'Toggles the state of the focused item.',
	},
	{
		key: 'ArrowDown',
		behavior: 'Moves focus to the next item depeding on `orientation`.',
	},
	{
		key: 'ArrowRight',
		behavior: 'Moves focus to the next item depeding on `orientation`.',
	},
	{
		key: 'ArrowDown',
		behavior: 'Moves focus to the previous item depeding on `orientation`.',
	},
	{
		key: 'ArrowLeft',
		behavior: 'Moves focus to the previous item depeding on `orientation`.',
	},
	{
		key: 'Home',
		behavior: 'Moves focus to the first item.',
	},
	{
		key: 'End',
		behavior: 'Moves focus to the last item.',
	},
];

const schemas = {
	builder,
	root,
	button,
	link,
	separator,
	groupBuilder,
	groupRoot,
	groupItem,
	keyboard,
};

const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Horizontal or vertical orientation',
];

export const toolbarData = {
	schemas,
	features,
};
