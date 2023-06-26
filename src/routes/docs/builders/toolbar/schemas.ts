import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateToolbarArgs',
	description: 'The configuration object passed to the `createToolbar` builder function.',
	args: [
		{
			label: 'loop',
			type: 'boolean',
			default: true,
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
			label: 'data-melt-part',
			value: '`toolbar`',
		},
	],
};

const button: APISchema = {
	title: 'Button',
	description: 'The toolbar button element.',
	dataAttributes: [
		{
			label: 'data-melt-part',
			value: '`toolbar-item`',
		},
	],
};

const link: APISchema = {
	title: 'Link',
	description: 'The toolbar link element.',
	dataAttributes: [
		{
			label: 'data-melt-part',
			value: '`toolbar-item`',
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
	],
};

const groupBuilder: APISchema = {
	title: 'CreateToolbarGroupArgs',
	description: 'Configuration options for the `createToolbarGroup` builder.',
	args: [
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
			default: false,
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
	],
};

const groupItem: APISchema = {
	title: 'Group Root',
	description: 'The root toolbar element for a toolbar group.',
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
			value: '`toolbar-item`',
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

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Tab',
			description: 'Moves focus to the first item in the group.',
		},
		{
			key: 'Space',
			description: 'Toggles the state of the focused item.',
		},
		{
			key: 'Enter',
			description: 'Toggles the state of the focused item.',
		},
		{
			key: 'ArrowDown',
			description: 'Moves focus to the next item depeding on `orientation`.',
		},
		{
			key: 'ArrowRight',
			description: 'Moves focus to the next item depeding on `orientation`.',
		},
		{
			key: 'ArrowDown',
			description: 'Moves focus to the previous item depeding on `orientation`.',
		},
		{
			key: 'ArrowLeft',
			description: 'Moves focus to the previous item depeding on `orientation`.',
		},
		{
			key: 'Home',
			description: 'Moves focus to the first item.',
		},
		{
			key: 'End',
			description: 'Moves focus to the last item.',
		},
	],
};

export const schemas = {
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
