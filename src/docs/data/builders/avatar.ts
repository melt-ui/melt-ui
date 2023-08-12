import { ATTRS, SEE } from '$docs/constants.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'src',
		type: 'string',
		default: '""',
		description: 'The source of the image to display.',
	},
	{
		name: 'delayMs',
		type: 'number',
		default: '0',
		description: 'The amount of time in milliseconds to wait before displaying the image.',
	},
];

const builder = builderSchema('avatar', {
	title: 'createAvatar',
	props: [
		...OPTION_PROPS,
		{
			name: 'loadingStatus',
			type: 'Writable<"loading" | "loaded" | "error">',
			description: 'An optional writable store used to control the loading status of the image.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onLoadingStatusChange',
			type: 'ChangeFn<"loading" | "loaded" | "error">',
			description: 'A callback invoked when the loading status store of the avatar changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'image',
			description: 'The builder store used to create the the image element.',
		},
		{
			name: 'fallback',
			description: 'The builder store used to create the fallback element.',
		},
	],
	states: [
		{
			name: 'loadingStatus',
			type: 'Writable<"loading" | "loaded" | "error">',
			description: 'A writable store with the current loading status of the image.',
		},
	],
	options: OPTION_PROPS,
});

const image = elementSchema('image', {
	description: 'The image element that is rendered when the `src` prop is provided.',
	dataAttributes: [
		{
			name: 'data-melt-avatar-image',
			value: ATTRS.MELT('avatar image'),
		},
	],
});

const fallback = elementSchema('fallback', {
	description:
		'The fallback element that is rendered before the image loads or if it fails to load.',
	dataAttributes: [
		{
			name: 'data-melt-avatar-fallback',
			value: ATTRS.MELT('avatar fallback'),
		},
	],
});

const schemas = [builder, image, fallback];

const features = [
	'Automatic & manual control over image rendering',
	'Fallback supports any children elements',
	'Optionally delay fallback rendering to avoid flashes',
];

export const avatarData: BuilderData = {
	schemas,
	features,
};
