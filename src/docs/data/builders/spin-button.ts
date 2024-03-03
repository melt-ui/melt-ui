import { ATTRS, DESCRIPTIONS, KBD, PROPS, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/content.js';
import type { BuilderData } from './index.js';

const OPTION_PROPS = [
	{
		name: 'min',
		type: 'number',
		description: 'The minimum value of the spin button.',
	},
	{
		name: 'max',
		type: 'number',
		description: 'The maximum value of the spin button.',
	},
	{
		name: 'step',
		type: 'number',
		description: 'The amount to increment or decrement by.',
		default: '1',
	},
	{
		name: 'loop',
		type: 'boolean',
		description:
			'Whether or not the spin button should loop back to `min` when `max` is reached, and vice versa.',
		default: 'false',
	},
	PROPS.DISABLED({
		name: 'spin button',
	}),
];

const builder = builderSchema('stepper', {
	title: 'createSpinButton',
	description: DESCRIPTIONS.BUILDER('stepper'),
	props: [
		{
			name: 'defaultValue',
			type: 'number',
			description: 'The uncontrolled default value of the stepper.',
			default: '0',
		},
		{
			name: 'value',
			type: 'Writable<number>',
			description: 'The controlled value store for the stepper.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<number>',
			description: 'The callback invoked when the value store of the stepper changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
		...OPTION_PROPS,
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the spin button element.',
		},
		{
			name: 'incrementer',
			description: 'The builder store used to create the increment button.',
		},
		{
			name: 'decrementer',
			description: 'The builder store used to create the decrement button.',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Writable<number>',
			description: 'A writable store that can be used to get the current value of the spin button.',
		},
		{
			name: 'previous',
			type: 'Readable<number | null>',
			description:
				'A readable store that can be used to get the previous value of the spin button.',
		},
		{
			name: 'next',
			type: 'Readable<number | null>',
			description: 'A readable store that can be used to get the next value of the spin button.',
		},
	],
	options: OPTION_PROPS,
	helpers: [
		{
			name: 'increment',
			type: '() => void',
			description: "Increses the spin button's value by `step`.",
		},
		{
			name: 'decrement',
			type: '() => void',
			description: "Decreases the spin button's value by `step`.",
		},
	],
});

const root = elementSchema('root', {
	description: 'The root spin button element that contains the increment and decrement buttons.',
	dataAttributes: [
		{
			name: 'data-melt-spin-button-root',
			value: ATTRS.MELT('spin button root'),
		},
	],
});

const incrementer = elementSchema('incrementer', {
	description: 'The stepper increment button.',
	dataAttributes: [
		{
			name: 'data-melt-spin-button-incrementer',
			value: ATTRS.MELT('spin button incrementer'),
		},
	],
});

const decrementer = elementSchema('decrementer', {
	description: 'The stepper decrement button.',
	dataAttributes: [
		{
			name: 'data-melt-stepper-decrementer',
			value: ATTRS.MELT('stepper decrementer'),
		},
	],
});

const schemas = [builder, root, incrementer, decrementer];

const features = [
	'Can be controlled or uncontrolled',
	'Supports both touch and click',
	'Supports bounded and unbounded ranges',
	'Supports a custom step size',
];

const keyboard: KeyboardSchema = [
	{
		key: KBD.ARROW_UP,
		behavior: 'Increases the value by `step`.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Decreases the value by `step`.',
	},
	{
		key: KBD.HOME,
		behavior: 'Sets the value to its minimum',
	},
	{
		key: KBD.END,
		behavior: 'Sets the value to its maximum',
	},
];

export const spinButtonData: BuilderData = {
	schemas,
	features,
	keyboard,
};
