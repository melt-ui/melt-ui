import { colord, type AnyColor, type Colord } from 'colord';
import { colorChannels, type ColorChannel, type ColorFormat } from './types';

export * from './types';

export function isColorChannel(value: unknown): value is ColorChannel {
	return !!value && colorChannels.includes(value as ColorChannel);
}

export function convertColor(c: AnyColor | Colord, format: ColorFormat) {
	switch (format) {
		case 'rgb':
			return colord(c).toRgbString();
		case 'hex':
			return colord(c).toHex();
		case 'hsl':
			return colord(c).toHslString();
		default:
			return JSON.stringify(c);
	}
}

export function isValidColor(color: string) {
	return colord(color).isValid();
}
