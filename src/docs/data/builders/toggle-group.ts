import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateToggleGroupArgs',
	description: 'The configuration object passed to the `createToggleGroup` builder function.',
	args: [
		{
			label: 'type',
			type: ["'single'", "'multiple'"],
			default: "'single'",
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
		{
			label: 'value',
			type: ["'string'", 'string[]', 'null'],
			default: 'null',
		},
		{
			label: 'rovingFocus',
			type: 'boolean',
			default: true,
		},
		{
			label: 'orientation',
			type: ["'horizontal'", "'vertical'"],
			default: "'horizontal'",
		},
		{
			label: 'loop',
			type: 'boolean',
			default: true,
		},
	],
};

const root: APISchema = {
	title: 'Root',
	description: 'The root toggle group element.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ["'horizontal'", "'vertical'"],
		},
		{
			label: 'data-melt-part',
			value: '`toggle-group`',
		},
	],
};

const item: APISchema = {
	title: 'Item',
	description: 'The toggle group item element.',
	args: [
		{
			label: 'value',
			type: 'string',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
	],
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ["'horizontal'", "'vertical'"],
		},
		{
			label: 'data-melt-part',
			value: '`toggle-group-item`',
		},
		{
			label: 'data-state',
			value: ["'on'", "'off'"],
		},
	],
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Tab',
			description: 'Moves focus to either the pressed item or the first item in the group.',
		},
		{
			key: 'Space',
			description: 'Activates/deactivates the item.',
		},
		{
			key: 'Enter',
			description: 'Activates/deactivates the item.',
		},
		{
			key: 'ArrowDown',
			description: 'Moves focus to the next item in the group.',
		},
		{
			key: 'ArrowRight',
			description: 'Moves focus to the next item in the group.',
		},
		{
			key: 'ArrowUp',
			description: 'Moves focus to the previous item in the group.',
		},
		{
			key: 'ArrowLeft',
			description: 'Moves focus to the previous item in the group.',
		},
		{
			key: 'Home',
			description: 'Moves focus to the first item in the group.',
		},
		{
			key: 'End',
			description: 'Moves focus to the last item in the group.',
		},
	],
};

const schemas = {
	builder,
	root,
	item,
	keyboard,
};

const features = [
	'Horizontal or vertical orientation',
	'Can be controlled or uncontrolled',
	'Full keyboard navigation',
];

export const toggleGroupData = {
	schemas,
	features,
};
