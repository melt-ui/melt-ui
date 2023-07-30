import { ATTRS, DESCRIPTIONS, SEE, propToOption } from '$docs/constants';
import type { APISchema } from '$docs/types';
import type { BuilderData } from '.';

const SRC_PROP = {
	name: 'src',
	type: 'string',
	default: '""',
	description: 'The source of the image to display.',
};

const DELAY_MS_PROP = {
	name: 'delayMs',
	type: 'number',
	default: '0',
	description: 'The amount of time in milliseconds to wait before displaying the image.',
};

const builder: APISchema = {
	title: 'createAvatar',
	description: DESCRIPTIONS.BUILDER('avatar'),
	props: [
		SRC_PROP,
		DELAY_MS_PROP,
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
			link: '#image',
		},
		{
			name: 'fallback',
			description: 'The builder store used to create the fallback element.',
			link: '#fallback',
		},
	],
	states: [
		{
			name: 'loadingStatus',
			type: 'Writable<"loading" | "loaded" | "error">',
			description: 'A writable store used to control the value of the loading status.',
		},
	],
	options: [propToOption(SRC_PROP), propToOption(DELAY_MS_PROP)],
};

const image: APISchema = {
	title: 'image',
	description: 'The image element that is rendered when the `src` prop is provided.',
	dataAttributes: [
		{
			name: 'data-melt-avatar-image',
			value: ATTRS.MELT('avatar image'),
		},
	],
};

const fallback: APISchema = {
	title: 'fallback',
	description:
		'The fallback element that is rendered before the image loads or if it fails to load.',
	dataAttributes: [
		{
			name: 'data-melt-avatar-fallback',
			value: ATTRS.MELT('avatar fallback'),
		},
	],
};

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
