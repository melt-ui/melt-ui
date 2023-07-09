import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createTags',
	description: 'The configuration object passed to the `createTagsInput` builder function.',
	props: [
		{
			label: 'placeholder',
			type: 'string',
			default: 'Enter tags...',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
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
			label: 'unique',
			type: 'boolean',
			default: 'false',
		},
	],
};

const tagsInput: APISchema = {
	title: 'tagsInput',
	description: 'The tags input component.',
	dataAttributes: [
		{
			label: 'data-melt-tags-input',
			value: 'Present on the tags input element.',
		},
		{
			label: 'data-disabled',
			value: 'Present if the item is disabled.',
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The input component',
	dataAttributes: [
		{
			label: 'data-melt-tags-input-input',
			value: 'Present on the input element.',
		},
		{
			label: 'data-disabled',
			value: 'Present if the item is disabled.',
		},
	],
};

const tag: APISchema = {
	title: 'item',
	description: 'The tag components.',
	props: [
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
			default: 'false',
		},
	],
	dataAttributes: [
		{
			label: 'data-melt-tags-input-tag',
			value: 'Present on the tag elements.',
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
			value: 'Present if the tag is disabled.',
		},
		{
			label: 'data-selected',
			value: 'Present if the tag is selected.',
		},
	],
};

const deleteTrigger: APISchema = {
	title: 'deleteTrigger',
	description: 'The button component used to delete a tag.',
	props: [
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
			default: 'false',
		},
	],
	dataAttributes: [
		{
			label: 'data-melt-tags-input-delete-trigger',
			value: 'Present on the delete trigger elements.',
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
			value: 'Present if the tag is disabled.',
		},
		{
			label: 'data-selected',
			value: 'Present if the tag is selected.',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'tab',
		behavior: 'Moves focus between tags and the input.',
	},
	{
		key: 'Delete',
		behavior: 'When focused on a tag, deletes it and moves focus to the right.',
	},
	{
		key: 'Backspace',
		behavior:
			'When focused on a tag, deletes it and moves focus to the left. If there are no tags to the left, either the next tags gets focus, or the input.',
	},

	{
		key: 'ArrowRight',
		behavior: 'Moves focus to the next tag or input.',
	},
	{
		key: 'ArrowLeft',
		behavior: 'Moves focus to the previous tag.',
	},
];

const schemas = {
	builder,
	tagsInput,
	input,
	tag,
	deleteTrigger,
	keyboard,
};

const features = [
	'Type in the input and press enter to add tags',
	'Delete tags',
	'Disable everything or disable specific tags',
	'Option to only allow unique tags',
	'Keyboard navigation',
];

export const tagsInputData = {
	schemas,
	features,
};
