import { ATTRS } from '$docs/constants';
import type { APISchema } from '$docs/types';

const builder: APISchema = {
	title: 'createAvatar',
	description: 'The builder function used to create an avatar component.',
	props: [
		{
			label: 'src',
			type: 'string',
			default: '""',
			description: 'The URL of the image to render.',
		},
		{
			label: 'delayMs',
			type: 'number',
			default: 'undefined',
			description: 'The number of milliseconds to wait before rendering the fallback image.',
		},
	],
};

const image: APISchema = {
	title: 'image',
	description: 'The image element that is rendered when the `src` prop is provided.',
	dataAttributes: [
		{
			label: 'data-melt-avatar-image',
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
			label: 'data-melt-avatar-fallback',
			value: ATTRS.MELT('avatar fallback'),
		},
	],
};

const schemas = {
	builder,
	image,
	fallback,
};

const features = [
	'Automatic & manual control over image rendering',
	'Fallback supports any children elements',
	'Optionally delay fallback rendering to avoid flashes',
];

export const avatarData = {
	schemas,
	features,
};
