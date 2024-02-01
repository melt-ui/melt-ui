import { ATTRS, KBD, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { pinInputIdParts } from '$lib/index.js';
import { pinInputEvents } from '$lib/builders/pin-input/events.js';
import { isMac } from '$lib/internal/helpers/index.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'placeholder',
		type: 'string',
		default: '○',
		description: 'The placeholder character to use for empty pin-inputs.',
	},
	{
		name: 'value',
		type: 'string[]',
		description: 'The value of the pin-input.',
	},
	{
		name: 'name',
		type: 'string',
		description: 'The name of the pin-input.',
	},
	{
		name: 'disabled',
		type: 'boolean',
		default: 'false',
		description: 'Whether or not the pin-input is disabled.',
	},
	{
		name: 'type',
		type: 'string',
		default: 'text',
		description: 'The type of the pin-input. Use `password` to mask the input.',
	},
];

const BUILDER_NAME = 'PIN input';

const builder = builderSchema(BUILDER_NAME, {
	ids: pinInputIdParts,
	title: 'createPinInput',
	props: [
		...OPTION_PROPS,
		{
			name: 'defaultValue',
			type: 'string[]',
			description: 'The default value of the pin-input.',
		},
		{
			name: 'value',
			type: 'Writable<string[]>',
			description: 'A writable store that controls the value of the pin-input.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<string[]>',
			description:
				'A callback called when the value of the `value` store should be changed. This is useful for controlling the value of the pin-input from outside the pin-input.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the pin-input root.',
		},
		{
			name: 'input',
			description: 'The builder store used to create the pin-input input.',
		},
		{
			name: 'hiddenInput',
			description: 'The builder store used to create the pin-input hidden input.',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Writable<string[]>',
			description: 'A writable store that returns the value of the pin-input.',
		},
		{
			name: 'valueStr',
			type: 'Readable<string>',
			description: 'A derived store that returns the value of the pin-input as a string.',
		},
	],
	helpers: [
		{
			name: 'clear',
			type: '() => void',
			description: 'A function that clears the pin-input.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
	description: 'The root pin-input element.',
	dataAttributes: [
		{
			name: 'data-complete',
			value: 'Present if the pin-input is complete.',
		},
		{
			name: 'data-melt-pin-input',
			value: ATTRS.MELT('pin-input'),
		},
	],
});

const input = elementSchema('input', {
	description: 'The pin-input input element.',
	dataAttributes: [
		{
			name: 'data-complete',
			value: 'Present if the pin-input is complete.',
		},
		{
			name: 'data-melt-pin-input-input',
			value: ATTRS.MELT('input'),
		},
	],
	events: pinInputEvents['input'],
});

const hiddenInput = elementSchema('hiddenInput', {
	description: 'The hidden input element that stores the pin-input value for form submission.',
	dataAttributes: [
		{
			name: 'data-melt-pin-input-hidden-input',
			value: ATTRS.MELT('hiddenInput'),
		},
	],
});

const keyboard: KeyboardSchema = [
	{
		key: KBD.ARROW_LEFT,
		behavior: 'Moves to the previous input.',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'Moves to the next input.',
	},
	{
		key: KBD.BACKSPACE,
		behavior:
			'Deletes the value of the current input. If the input is empty, moves to the previous input and deletes that value as well.',
	},
	{
		key: KBD.DELETE,
		behavior: 'Deletes the value of the current input.',
	},
	{
		key: `${isMac() ? '⌘' : 'Ctrl'} + V`,
		behavior:
			'Pastes the contents of the clipboard into the pin input.\
			If the number of characters in the clipboard equals exceeds the number of inputs, the contents are pasted from the first input.\
			Otherwise, the contents are pasted from the current input onwards.',
	},
];

const schemas = [builder, root, input, hiddenInput];

const features = ['Fully managed focus', 'Supports pasting from clipboard', 'Keyboard navigation'];

export const pinInputData: BuilderData = {
	schemas,
	features,
	keyboard,
	name: BUILDER_NAME,
};
