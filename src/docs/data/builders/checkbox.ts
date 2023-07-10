import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createCheckbox',
	description: DESCRIPTIONS.BUILDER('checkbox'),
	props: [
		{
			name: 'checked',
			type: ['boolean', '"indeterminate"'],
			default: 'false',
			description:
				'The initial checked state of the checkbox. `"indeterminate"` is used to indicate that the checkbox is in an indeterminate state.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the checkbox is disabled.',
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the checkbox is required.',
		},
		{
			name: 'name',
			type: 'string',
			description: 'The name of the checkbox.',
		},
		{
			name: 'value',
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
			name: 'data-disabled',
			value: ATTRS.DISABLED(),
		},
		{
			name: 'data-state',
			value: ATTRS.CHECKBOX_STATE,
		},
		{
			name: 'data-melt-checkbox',
			value: ATTRS.MELT('checkbox'),
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The native input element.',
	dataAttributes: [
		{
			name: 'data-melt-checkbox-input',
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

const schemas = [builder, root, input];

const features = [
	'Supports indeterminate state',
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
];

export const checkboxData: BuilderData = {
	schemas,
	features,
	keyboard,
};
