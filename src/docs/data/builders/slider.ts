import { ATTRS, KBD, PROPS, SEE, TYPES } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { sliderIdParts } from '$lib';
import { sliderEvents } from '$lib/builders/slider/events.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'min',
		type: 'number',
		default: '0',
		description: 'The minimum value of the slider.',
	},
	{
		name: 'max',
		type: 'number',
		default: '100',
		description: 'The maximum value of the slider.',
	},
	{
		name: 'step',
		type: 'number',
		default: '1',
		description: 'The amount to increment/decrement the value by when using the keyboard.',
	},
	{
		name: 'orientation',
		type: TYPES.ORIENTATION,
		default: "'horizontal'",
		description: 'The orientation of the slider.',
	},
	PROPS.DISABLED,
];
const BUILDER_NAME = 'slider';

const builder = builderSchema(BUILDER_NAME, {
	ids: sliderIdParts,
	title: 'createSlider',
	props: [
		...OPTION_PROPS,
		{
			name: 'defaultValue',
			type: 'number[]',
			default: '[]',
			description:
				'The default value of the slider. Pass in multiple values for multiple thumbs, creating a range slider.',
		},
		{
			name: 'value',
			type: 'Writable<number>',
			description: 'A writable store that can be used to update the slider value.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<number>',
			description: 'A callback that is called when the value of the slider changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the root slider element.',
		},
		{
			name: 'slider',
			description: 'An alias for the `root` builder store.',
			link: '#root',
		},
		{
			name: 'range',
			description: 'The builder store used to create the slider range element.',
		},
		{
			name: 'thumb',
			description: 'The builder store used to create the slider thumb element.',
		},
		{
			name: 'tick',
			description: 'The builder store used to create the slider tick element.',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Writable<number[]>',
			description: 'A writable store that can be used to get the current value of the slider.',
		},
		{
			name: 'ticks',
			type: 'Readable<number>',
			description: 'A readable store that can be used to get the current number of ticks.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
	description: 'The slider component.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-slider',
			value: ATTRS.MELT('slider'),
		},
	],
});

const range = elementSchema('range', {
	description: 'The slider range component.',
	dataAttributes: [
		{
			name: 'data-melt-slider-range',
			value: ATTRS.MELT('slider range'),
		},
	],
});

const thumb = elementSchema('thumb', {
	description: 'The slider thumb component.',
	dataAttributes: [
		{
			name: 'data-melt-slider-thumb',
			value: ATTRS.MELT('slider thumb'),
		},
	],
	events: sliderEvents['thumb'],
});

const tick = elementSchema('tick', {
	description: 'The slider tick component.',
	dataAttributes: [
		{
			name: 'data-melt-slider-tick',
			value: ATTRS.MELT('slider tick'),
		},
		{
			name: 'data-bounded',
			value: "Present when a tick is inside the `value`'s bounds.",
		},
	],
});

const schemas = [builder, root, thumb, range, tick];

const features = [
	'Supports multiple thumbs',
	'Can be controlled or uncontrolled',
	'Supports a minimum value between thumbs',
	'Supports both touch and click',
	'Supports a custom step size',
	'Can be vertical or horizontal',
];

const keyboard: KeyboardSchema = [
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'Increments/decrements by the `step` value depending on `orientation`.',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior: 'Increments/decrements by the `step` value depending on `orientation`.',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'Increases the value by the `step` amount.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Decreases the value by the `step` amount.',
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

export const sliderData: BuilderData = {
	schemas,
	features,
	keyboard,
};
