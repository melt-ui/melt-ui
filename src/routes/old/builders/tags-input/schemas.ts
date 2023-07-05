import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateTagsInputArgs',
	description: 'The configuration object passed to the `createTagsInput` builder function.',
	args: [
		{
			label: 'placeholder',
			type: 'string',
			default: 'Enter tags...',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
		{
			label: 'selected',
			type: '{id: string, value: string}',
		},
		{
			label: 'tags',
			type: 'string[] | {id: string, value: string}[]',
			default: '[]',
		},
		{
			label: 'blur',
			type: 'nothing | add | clear',
			default: 'nothing',
		},
		{
			label: 'unique',
			type: 'boolean',
			default: false,
		},
		{
			label: 'addOnPaste',
			type: 'boolean',
			default: false,
		},
		{
			label: 'maxTags',
			type: 'number',
		},
		{
			label: 'allowed',
			type: 'string[]',
			default: '[]',
		},
		{
			label: 'denied',
			type: 'string[]',
			default: '[]',
		},
		{
			label: 'add',
			type: '(tag: string) => Promise<Tag | string>',
		},
		{
			label: 'remove',
			type: '(tag: Tag) => Promise<boolean>',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The root component.',
	dataAttributes: [
		{
			label: 'data-melt-tags-input',
			value: '',
		},
		{
			label: 'data-focus',
			value: 'Present when the root is in focus',
		},
		{
			label: 'data-disabled',
			value: 'Present when the root is disabled',
		},
		{
			label: 'data-invalid',
			value: 'Present when the input data is invalid',
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The input component',
	dataAttributes: [
		{
			label: 'data-melt-tags-input-input',
			value: '',
		},
		{
			label: 'data-disabled',
			value: 'Present when the input is disabled',
		},
		{
			label: 'data-focus',
			value: 'Present when the input is in focus',
		},
		{
			label: 'data-invalid',
			value: 'Present when the input data is invalid',
		},
	],
};

const tag: APISchema = {
	title: 'tag',
	description: 'The tag component.',
	args: [
		{
			label: 'id',
			type: 'string',
		},
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
			label: 'data-melt-tags-input-tag',
			value: '',
		},
		{
			label: 'data-tag-id',
			value: 'Tag ID',
		},
		{
			label: 'data-tag-value',
			value: 'Tag value',
		},
		{
			label: 'data-selected',
			value: 'Present when selected',
		},
		{
			label: 'data-disabled',
			value: 'Present when disabled',
		},
	],
};

const deleteTrigger: APISchema = {
	title: 'deleteTrigger',
	description: 'The tag components.',
	args: [
		{
			label: 'id',
			type: 'string',
		},
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
			label: 'data-melt-tags-input-delete-trigger',
			value: '',
		},
		{
			label: 'data-tag-id',
			value: 'Unique tag ID.',
		},
		{
			label: 'data-tag-value',
			value: 'Tag value',
		},
		{
			label: 'data-selected',
			value: 'Present when selected',
		},
		{
			label: 'data-disabled',
			value: 'Present when disabled',
		},
	],
};

const options: APISchema = {
	title: 'options',
	description: 'The `$options` store can be used to override initial values set during creation.',
};

const tags: APISchema = {
	title: 'tags',
	description:
		'The `$tags` store holds an object array of type `Tag`. Each `Tag` consists of an id and value.',
};

const selected: APISchema = {
	title: 'selected',
	description: 'The `$selected` store holds the currently selected `Tag`, if there is one.',
};

const value: APISchema = {
	title: 'value',
	description: '`$value` is a readable store, which holds the input value.',
};

const invalid: APISchema = {
	title: 'invalid',
	description:
		'`$invalid` is a readable store of type `boolean`. When `true`, the input valid is considered invalid.',
};

const isSelected: APISchema = {
	title: 'isSelected',
	description: '`$isSelected` is a helper function to determine if a specific `Tag` is selected.',
	args: [
		{
			label: 'Tag',
			type: '{id: string, value: string}',
		},
	],
};

const keyboard = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'ArrowRight',
			description: 'Move to the next element of `tag` or `input`',
		},
		{
			key: 'ArrowLeft',
			description: 'Move to the previous `tag`, if one exists',
		},
		{
			key: 'Home',
			description: 'Jump to the first `tag`, if one exists',
		},
		{
			key: 'End',
			description: 'Jump to the `input`',
		},
		{
			key: 'Delete',
			description: 'Delete the selected `tag` and move to the next element of `tag` or `input`',
		},
		{
			key: 'Backspace',
			description:
				'Delete the selected `tag` and move to the previous tag. If this is the first tag, delete and move to the next element of `tag` or `input`',
		},
	],
};

export const schemas = {
	builder,
	root,
	input,
	tag,
	deleteTrigger,
	options,
	tags,
	selected,
	value,
	invalid,
	isSelected,
	keyboard,
};
