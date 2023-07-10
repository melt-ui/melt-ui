import { ATTRS } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createTags',
	description: 'The builder function used to create a tags input component.',
	props: [
		{
			label: 'placeholder',
			type: 'string',
			description: 'The placeholder text for the input element.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the tags input is disabled.',
		},
		{
			label: 'selectedTag',
			type: '{id: string, value: string}',
			description: 'The selected tag.',
		},
		{
			label: 'tags',
			type: ['string[]', '{id: string, value: string}[]'],
			default: '[]',
			description: 'The tag items.',
		},
		{
			label: 'unique',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the tags input should only allow unique tags.',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The root tags input component.',
	dataAttributes: [
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED('tags input'),
		},
		{
			label: 'data-focus',
			value: 'Present if the tags input is focused.',
		},
		{
			label: 'data-invalid',
			value: 'Present if the tags input is invalid.',
		},
		{
			label: 'data-invalid-edit',
			value: 'Present if the tags input is invalid while editing a tag.',
		},
		{
			label: 'data-melt-tags-input',
			value: ATTRS.MELT('tags input'),
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The hidden input element used for form submission.',
	dataAttributes: [
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED('input'),
		},
		{
			label: 'data-focus',
			value: 'Present if the input is focused.',
		},
		{
			label: 'data-invalid',
			value: 'Present if the input is invalid.',
		},
		{
			label: 'data-melt-tags-input-input',
			value: ATTRS.MELT('input'),
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
			description: 'A unique ID for the tag',
		},
		{
			label: 'value',
			type: 'string',
			description: "The tag's value",
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the tag is disabled.',
		},
	],
	dataAttributes: [
		{
			label: 'data-tag-id',
			value: 'The unique ID of the tag',
		},
		{
			label: 'data-tag-value',
			value: 'The value of the tag',
		},
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED('tag'),
		},
		{
			label: 'data-editing',
			value: 'Present if the tag is being edited.',
		},
		{
			label: 'data-selected',
			value: ATTRS.SELECTED('tag'),
		},
		{
			label: 'data-melt-tags-input-tag',
			value: ATTRS.MELT('tag'),
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
			description: 'The tag ID the delete trigger will delete.',
		},
		{
			label: 'value',
			type: 'string',
			description: 'The tag value the delete trigger will delete.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the delete trigger is disabled.',
		},
	],
	dataAttributes: [
		{
			label: 'data-tag-id',
			value: 'The unique ID of the tag associated with the delete trigger',
		},
		{
			label: 'data-tag-value',
			value: 'The value of the tag associated with the delete trigger.',
		},
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED('delete trigger'),
		},
		{
			label: 'data-selected',
			value: ATTRS.SELECTED('delete trigger'),
		},
		{
			label: 'data-editing',
			value: 'Present if the tag is being edited.',
		},
		{
			label: 'data-melt-tags-input-delete-trigger',
			value: ATTRS.MELT('delete trigger'),
		},
	],
};

const edit: APISchema = {
	title: 'edit',
	description: 'The button component used to edit a tag.',
	props: [
		{
			label: 'id',
			type: 'string',
			description: 'The tag ID the edit trigger will edit.',
		},
		{
			label: 'value',
			type: 'string',
			description: 'The tag value the edit trigger will edit.',
		},
	],
	dataAttributes: [
		{
			label: 'data-tag-id',
			value: 'The unique ID of the tag associated with the edit component',
		},
		{
			label: 'data-tag-value',
			value: 'The value of the tag associated with the edit component.',
		},
		{
			label: 'data-melt-tags-input-edit',
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

const schemas = {
	builder,
	root,
	input,
	tag,
	deleteTrigger,
	edit,
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
