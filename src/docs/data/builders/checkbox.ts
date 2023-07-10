import { ATTRS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createCheckbox',
	description: 'The builder function used to create a checkbox component.',
	props: [
		{
			label: 'checked',
			type: ['boolean', '"indeterminate"'],
			default: 'false',
			description:
				'The initial checked state of the checkbox. `"indeterminate"` is used to indicate that the checkbox is in an indeterminate state.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the checkbox is disabled.',
		},
		{
			label: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the checkbox is required.',
		},
		{
			label: 'name',
			type: 'string',
			description: 'The name of the checkbox.',
		},
		{
			label: 'value',
			type: 'string',
			description: 'The value of the checkbox.',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The checkbox element.',
	dataAttributes: [
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED(),
		},
		{
			label: 'data-state',
			value: ATTRS.CHECKBOX_STATE,
		},
		{
			label: 'data-melt-checkbox',
			value: ATTRS.MELT('checkbox'),
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The native input element.',
	dataAttributes: [
		{
			label: 'data-melt-checkbox-input',
			value: ATTRS.MELT('checkbox input'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'Toggles the checkbox state.',
	},
];

const schemas = {
	builder,
	root,
	input,
	keyboard,
};

const features = [
	'Supports indeterminate state',
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
];

export const checkboxData = {
	schemas,
	features,
};
