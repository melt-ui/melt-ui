import { ATTRS, DESCRIPTIONS, KBD, PROPS, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/content.js';
import type { BuilderData } from './index.js';

const OPTION_PROPS = [
	{
		name: 'min',
		type: 'number',
		description: 'The minimum value of the stepper.',
	},
	{
		name: 'max',
		type: 'number',
		description: 'The maximum value of the stepper.',
	},
	{
		name: 'step',
		type: 'number',
		description: 'The amount to increment or decrement by.',
		default: '1',
	},
	PROPS.DISABLED({
		name: 'stepper',
	}),
];

const builder = builderSchema('stepper', {
	title: 'createStepper',
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
			name: 'stepper',
			description: 'The builder store used to create the stepper element.',
		},
		{
			name: 'incrementButton',
			description: 'The builder store used to create the increment button.',
		},
		{
			name: 'decrementButton',
			description: 'The builder store used to create the decrement button.',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Writable<number>',
			description: 'A writable store that can be used to get the current value of the stepper.',
		},
		{
			name: 'previous',
			type: 'Readable<number | null>',
			description: 'A readable store that can be used to get the previous value of the stepper.',
		},
		{
			name: 'next',
			type: 'Readable<number | null>',
			description: 'A readable store that can be used to get the next value of the stepper.',
		},
	],
	options: OPTION_PROPS,
	helpers: [
		{
			name: 'increment',
			type: '() => void',
			description: "Increses the stepper's value by `step`.",
		},
		{
			name: 'decrement',
			type: '() => void',
			description: "Decreases the stepper's value by `step`.",
		},
	],
});

const stepper = elementSchema('stepper', {
	description: 'The stepper component.',
	dataAttributes: [
		{
			name: 'data-melt-stepper',
			value: ATTRS.MELT('stepper'),
		},
	],
});

const incrementButton = elementSchema('incrementButton', {
	description: 'The stepper increment button component.',
	dataAttributes: [
		{
			name: 'data-melt-stepper-increment-button',
			value: ATTRS.MELT('stepper increment button'),
		},
	],
});

const decrementButton = elementSchema('decrementButton', {
	description: 'The stepper decrement button component.',
	dataAttributes: [
		{
			name: 'data-melt-stepper-decrement-button',
			value: ATTRS.MELT('stepper decrement button'),
		},
	],
});

const schemas = [builder, stepper, incrementButton, decrementButton];

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

export const stepperData: BuilderData = {
	schemas,
	features,
	keyboard,
};
