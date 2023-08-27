import { ATTRS, KBD, PROPS, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { switchEvents } from '$lib/builders/switch/events.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	PROPS.DISABLED,
	PROPS.REQUIRED,
	{
		name: 'name',
		type: 'string',
		description: 'The name of the hidden input element used for form submission..',
	},
	{
		name: 'value',
		type: 'string',
		description: 'The value of the hidden input element used for form submission.',
	},
];

const BUILDER_NAME = 'switch';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createSwitch',
	props: [
		...OPTION_PROPS,
		{
			name: 'defaultChecked',
			type: 'boolean',
			default: 'false',
			description: 'The initial checked state of the switch.',
		},
		{
			name: 'checked',
			type: 'Writable<boolean>',
			description:
				'The controlled checked state store of the switch. If provided, this will override the value passed to `defaultChecked`.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onCheckedChange',
			type: 'ChangeFn<boolean>',
			description:
				'A callback called when the value of the `checked` store should be changed. This is useful for controlling the checked state of the switch from outside the switch.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the switch root.',
			link: '#root',
		},
		{
			name: 'input',
			description: 'The builder store used to create the switch input.',
			link: '#input',
		},
	],
	states: [
		{
			name: 'checked',
			type: 'Writable<boolean>',
			description: 'A writable store that returns whether or not the switch is checked.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
	description: 'The switch element.',
	dataAttributes: [
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('switch'),
		},
		{
			name: 'data-state',
			value: ATTRS.CHECKED_UNCHECKED,
		},
		{
			name: 'data-melt-switch',
			value: ATTRS.MELT('switch'),
		},
	],
	events: switchEvents['root'],
});

const input = elementSchema('input', {
	description: 'The hidden input element used for form submission.',
	dataAttributes: [
		{
			name: 'data-melt-switch-input',
			value: ATTRS.MELT('input'),
		},
	],
});

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'When the switch has focus, toggles the switch.',
	},
	{
		key: KBD.ENTER,
		behavior: 'When the switch has focus, toggles the switch.',
	},
];

const schemas = [builder, root, input];
const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];

export const switchData: BuilderData = {
	schemas,
	features,
	keyboard,
};
