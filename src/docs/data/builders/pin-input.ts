import type { APISchema, KeyboardSchema } from '$docs/types';
import { isMac } from '@melt-ui/svelte/internal/helpers';
import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';

const builder: APISchema = {
	title: 'createPinInput',
	description: DESCRIPTIONS.BUILDER('pin input'),
	props: [
		{
			label: 'placeholder',
			type: 'string',
			default: '○',
			description: 'The placeholder character to use for empty pin-inputs.',
		},
		{
			label: 'value',
			type: 'string[]',
			description: 'The value of the pin-input.',
		},
		{
			label: 'name',
			type: 'string',
			description: 'The name of the pin-input.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the pin-input is disabled.',
		},
		{
			label: 'type',
			type: 'string',
			default: 'text',
			description: 'The type of the pin-input.',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The root pin-input element.',
	dataAttributes: [
		{
			label: 'data-complete',
			value: 'Present if the pin-input is complete.',
		},
		{
			label: 'data-melt-pin-input',
			value: ATTRS.MELT('pin-input'),
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The pin-input input element.',
	dataAttributes: [
		{
			label: 'data-complete',
			value: 'Present if the pin-input is complete.',
		},
		{
			label: 'data-melt-pin-input-input',
			value: ATTRS.MELT('input'),
		},
	],
};

const hiddenInput: APISchema = {
	title: 'hiddenInput',
	description: 'The hidden input element that stores the pin-input value for form submission.',
	dataAttributes: [
		{
			label: 'data-melt-pin-input-hidden-input',
			value: ATTRS.MELT('hiddenInput'),
		},
	],
};

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
			'Deletes the value of the current input. If the input is empty, moves to the previous input.',
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

const schemas = {
	builder,
	root,
	input,
	hiddenInput,
	keyboard,
};

const features = ['Fully managed focus', 'Supports pasting from clipboard', 'Keyboard navigation'];

export const pinInputData = {
	schemas,
	features,
};
