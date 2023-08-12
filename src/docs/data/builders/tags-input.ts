import { ATTRS, PROPS, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { tagsInputEvents } from '$lib/builders/tags-input/events.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	PROPS.DISABLED,
	{
		name: 'placeholder',
		type: 'string',
		description: 'The placeholder text for the input element.',
	},
	{
		name: 'editable',
		type: 'boolean',
		default: 'true',
		description: 'Whether or not the input is editable.',
	},
	{
		name: 'selected',
		type: 'Tag',
		description: 'The selected tag.',
		longType: {
			rawCode: `type Tag = { 
    id: string; 
    value: string;
}`,
		},
	},
	{
		name: 'unique',
		type: 'boolean',
		default: 'false',
		description: 'Whether or not the tags input should only allow unique tags.',
	},
	{
		name: 'trim',
		type: 'boolean',
		default: 'true',
		description:
			'Whether or not whitespace from both ends of input string should be removed when a tag is added.',
	},
	{
		name: 'blur',
		type: 'boolean',
		description: 'Whether or not the input should blur when a tag is added.',
		default: 'true',
	},
	{
		name: 'addOnPaste',
		type: 'boolean',
		description: 'Whether or not the input should add tags on paste.',
		default: 'true',
	},
	{
		name: 'maxTags',
		type: 'number',
		description: 'The maximum number of tags allowed.',
		default: 'Infinity',
	},
	{
		name: 'allowed',
		type: 'string[]',
		description: 'The allowed tags.',
		default: '[]',
	},
	{
		name: 'disallowed',
		type: 'string[]',
		description: 'The disallowed tags.',
		default: '[]',
	},
	{
		name: 'add',
		type: '(tag: string) => Promise<Tag | string>',
		description: 'A function that adds a tag.',
	},
	{
		name: 'remove',
		type: '(tag: Tag) => Promise<boolean>',
		description: 'A function that removes a tag.',
	},
	{
		name: 'update',
		type: '(tag: Tag) => Promise<Tag>',
		description: 'A function that updates a tag.',
	},
];

const BUILDER_NAME = 'tags input';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createTags',
	props: [
		...OPTION_PROPS,
		{
			name: 'defaultTags',
			type: 'string[] | Tag[]',
			description: 'The default tags to populate the tags input with.',
		},
		{
			name: 'tags',
			type: 'Writable<Tag[]>',
			description: 'A writable store that controls the tags.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onTagsChange',
			type: 'ChangeFn<Tags[]>',
			description: 'A function that is called when the tags change.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the tags input root.',
		},
		{
			name: 'input',
			description: 'The builder store used to create the tags input input.',
		},
		{
			name: 'tag',
			description: 'The builder store used to create the tags input tag.',
		},
		{
			name: 'deleteTrigger',
			description: 'The builder store used to create the tags input delete trigger.',
		},
		{
			name: 'edit',
			description: 'The builder store used to create the tags input edit.',
		},
	],
	states: [
		{
			name: 'tags',
			type: 'Readable<Tag[]>',
			description: 'A derived store that returns the tags.',
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
			name: 'selected',
			type: 'Readable<Tag | null>',
			description: 'A derived store that returns the selected tag.',
		},
	],
	helpers: [
		{
			name: 'isSelected',
			type: 'Readable<(tag: Tag) => boolean>',
			description: 'A derived store that returns a function that checks if a tag is selected.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
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
	events: tagsInputEvents['root'],
});

const input = elementSchema('input', {
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
	events: tagsInputEvents['input'],
});

const tag = elementSchema('tag', {
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
	events: tagsInputEvents['tag'],
});

const deleteTrigger = elementSchema('deleteTrigger', {
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
	events: tagsInputEvents['deleteTrigger'],
});

const edit = elementSchema('edit', {
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
	events: tagsInputEvents['edit'],
});

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
