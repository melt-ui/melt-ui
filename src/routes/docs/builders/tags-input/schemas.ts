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
			label: 'selectedTag',
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
			label: 'allowedTags',
			type: 'string[]',
			default: '[]',
		},
		{
			label: 'deniedTags',
			type: 'string[]',
			default: '[]',
		},
		{
			label: 'validator',
			type: '(tag: string) => boolean',
		},
		{
			label: 'add',
			type: '(tag: string) => Promise<Tag | string>',
		},
	],
};

const root: APISchema = {
	title: 'Root',
	description: 'The root component.',
	dataAttributes: [
		{
			label: 'data-melt-part',
			value: '`tags-input`',
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
	title: 'Input',
	description: 'The input component',
	dataAttributes: [
		{
			label: 'data-melt-part',
			value: '`tags-input-input`',
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
	title: 'Tag',
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
			label: 'data-melt-part',
			value: '`tags-input-tag`',
		},
		{
			label: 'data-tag-id',
			value: 'Unique tag ID',
		},
		{
			label: 'data-tag-value',
			value: 'Tag value',
		},
		{
			label: 'data-selected',
			value: 'Present when the tag is selected',
		},
		{
			label: 'data-disabled',
			value: 'Present when the tag is disabled',
		},
	],
};

const deleteTrigger: APISchema = {
	title: 'Delete Trigger',
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
			label: 'data-melt-part',
			value: '`tags-input-delete-trigger`',
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
			label: 'data-disabled',
			value: 'Present when the tag is disabled',
		},
		{
			label: 'data-selected',
			value: 'Present when the tag is selected',
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
	keyboard,
};
