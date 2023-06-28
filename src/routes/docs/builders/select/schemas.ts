import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateSelectArgs',
	description: 'The configuration object passed to the `createSelect` builder function.',
	args: [
		{
			label: 'required',
			type: 'boolean',
			default: false,
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
		{
			label: 'label',
			type: 'string',
		},
		{
			label: 'value',
			type: 'unknown',
		},
		{
			label: 'name',
			type: 'string',
		},
	],
};

const trigger: APISchema = {
	title: 'Trigger',
	description: 'The element which opens/closes the select.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ['"open"', '"closed"'],
		},
		{
			label: 'data-disabled',
			value: 'Present if the `select` element is disabled.',
		},
	],
};

const option: APISchema = {
	title: 'Option',
	description: 'The option elements',
	args: [
		{
			label: 'label',
			type: 'string',
		},
		{
			label: 'value',
			type: 'unknown',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
	],
};

const arrow: APISchema = {
	title: 'Arrow',
	description: 'The optional arrow element',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: ['"true"'],
		},
	],
};

const separator: APISchema = {
	title: 'Separator',
	description: 'An optional separator element',
};

const group: APISchema = {
	title: 'createGroup',
	description: 'An optional builder used to group options together.',
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description:
				'When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option.',
		},
		{
			key: 'Enter',
			description:
				'When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option.',
		},
		{
			key: 'ArrowDown',
			description:
				'When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the next option.',
		},
		{
			key: 'ArrowUp',
			description:
				'When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the previous option.',
		},
		{
			key: 'Esc',
			description: 'Closes the select and moves focus to the `trigger`.',
		},
	],
};

export const schemas = {
	builder,
	trigger,
	option,
	arrow,
	group,
	separator,
	keyboard,
};
