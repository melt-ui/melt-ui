import { ATTRS, DESCRIPTIONS } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createTags',
	description: DESCRIPTIONS.BUILDER('tags input'),
	props: [
		{
			name: 'placeholder',
			type: 'string',
			description: 'The placeholder text for the input element.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the tags input is disabled.',
		},
		{
			name: 'selectedTag',
			type: '{id: string, value: string}',
			description: 'The selected tag.',
		},
		{
			name: 'tags',
			type: ['string[]', '{id: string, value: string}[]'],
			default: '[]',
			description: 'The tag items.',
		},
		{
			name: 'unique',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the tags input should only allow unique tags.',
		},
	],
	returnedProps: [
		{
			name: 'options',
			type: 'Writable<CreateTagsInputProps>',
			description: 'A writable store that contains the props used to create the tags input.',
		},
		{
			name: 'tags',
			type: 'Writable<Tag[]>',
			description: 'A writable store that controls the tags.',
		},
		{
			name: 'selected',
			type: 'Writable<Tag | null>',
			description: 'A writable store that controls the selected tag.',
		},
		{
			name: 'isSelected',
			type: 'Readable<(tag: Tag) => boolean>',
			description: 'A derived store that returns a function that checks if a tag is selected.',
		},
		{
			name: 'inputValue',
			type: 'Readable<string>',
			description: 'A derived store that returns the value of the input element.',
		},
		{
			name: 'inputInvalid',
			type: 'Readable<boolean>',
			description: 'A derived store that returns whether or not the input element is invalid.',
		},
		{
			name: 'root',
			description: 'The builder store used to create the tags input root.',
			link: '#root',
		},
		{
			name: 'input',
			description: 'The builder store used to create the tags input input.',
			link: '#input',
		},
		{
			name: 'tag',
			description: 'The builder store used to create the tags input tag.',
			link: '#tag',
		},
		{
			name: 'deleteTrigger',
			description: 'The builder store used to create the tags input delete trigger.',
			link: '#deletetrigger',
		},
		{
			name: 'edit',
			description: 'The builder store used to create the tags input edit.',
			link: '#edit',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The root tags input component.',
	dataAttributes: [
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('tags input'),
		},
		{
			name: 'data-focus',
			value: 'Present if the tags input is focused.',
		},
		{
			name: 'data-invalid',
			value: 'Present if the tags input is invalid.',
		},
		{
			name: 'data-invalid-edit',
			value: 'Present if the tags input is invalid while editing a tag.',
		},
		{
			name: 'data-melt-tags-input',
			value: ATTRS.MELT('tags input'),
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The hidden input element used for form submission.',
	dataAttributes: [
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('input'),
		},
		{
			name: 'data-focus',
			value: 'Present if the input is focused.',
		},
		{
			name: 'data-invalid',
			value: 'Present if the input is invalid.',
		},
		{
			name: 'data-melt-tags-input-input',
			value: ATTRS.MELT('input'),
		},
	],
};

const tag: APISchema = {
	title: 'tag',
	description: 'The tag components.',
	props: [
		{
			name: 'id',
			type: 'string',
			description: 'A unique ID for the tag',
			required: true,
		},
		{
			name: 'value',
			type: 'string',
			description: "The tag's value",
			required: true,
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the tag is disabled.',
		},
	],
	dataAttributes: [
		{
			name: 'data-tag-id',
			value: 'The unique ID of the tag',
		},
		{
			name: 'data-tag-value',
			value: 'The value of the tag',
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('tag'),
		},
		{
			name: 'data-editing',
			value: 'Present if the tag is being edited.',
		},
		{
			name: 'data-selected',
			value: ATTRS.SELECTED('tag'),
		},
		{
			name: 'data-melt-tags-input-tag',
			value: ATTRS.MELT('tag'),
		},
	],
};

const deleteTrigger: APISchema = {
	title: 'deleteTrigger',
	description: 'The button component used to delete a tag.',
	props: [
		{
			name: 'id',
			type: 'string',
			description: 'The tag ID the delete trigger will delete.',
			required: true,
		},
		{
			name: 'value',
			type: 'string',
			description: 'The tag value the delete trigger will delete.',
			required: true,
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the delete trigger is disabled.',
		},
	],
	dataAttributes: [
		{
			name: 'data-tag-id',
			value: 'The unique ID of the tag associated with the delete trigger',
		},
		{
			name: 'data-tag-value',
			value: 'The value of the tag associated with the delete trigger.',
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('delete trigger'),
		},
		{
			name: 'data-selected',
			value: ATTRS.SELECTED('delete trigger'),
		},
		{
			name: 'data-editing',
			value: 'Present if the tag is being edited.',
		},
		{
			name: 'data-melt-tags-input-delete-trigger',
			value: ATTRS.MELT('delete trigger'),
		},
	],
};

const edit: APISchema = {
	title: 'edit',
	description: 'The button component used to edit a tag.',
	props: [
		{
			name: 'id',
			type: 'string',
			description: 'The tag ID the edit trigger will edit.',
			required: true,
		},
		{
			name: 'value',
			type: 'string',
			description: 'The tag value the edit trigger will edit.',
			required: true,
		},
	],
	dataAttributes: [
		{
			name: 'data-tag-id',
			value: 'The unique ID of the tag associated with the edit component',
		},
		{
			name: 'data-tag-value',
			value: 'The value of the tag associated with the edit component.',
		},
		{
			name: 'data-melt-tags-input-edit',
			value: ATTRS.MELT('edit'),
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

const schemas = [builder, root, tag, deleteTrigger, edit, input];

const features = [
	'Type in the input and press enter to add tags',
	'Delete tags',
	'Disable everything or disable specific tags',
	'Option to only allow unique tags',
	'Keyboard navigation',
];

export const tagsInputData: BuilderData = {
	schemas,
	features,
	keyboard,
};
