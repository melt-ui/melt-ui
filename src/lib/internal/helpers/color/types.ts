import type { getFormat } from 'colord';

export const colorChannels = [
	'hue',
	'saturation',
	'lightness',
	'red',
	'green',
	'blue',
	'alpha',
] as const;
export type ColorChannel = (typeof colorChannels)[number];

// export type ColorFormat = NonNullable<ReturnType<typeof getFormat>>;
export type ColorFormat = 'rgb' | 'hex' | 'hsl';
