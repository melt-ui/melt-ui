import {
	colord,
	type AnyColor,
	type Colord,
	getFormat,
	type RgbaColor,
	type HslaColor,
} from 'colord';
import { colorChannels, type ColorChannel, type ColorFormat } from './types';

export * from './types';

export function isColorChannel(value: unknown): value is ColorChannel {
	return !!value && colorChannels.includes(value as ColorChannel);
}

export function convertColor(c: AnyColor | Colord, format: ColorFormat, string: true): string;
export function convertColor(c: AnyColor | Colord, format: 'hex', string?: boolean): string;
export function convertColor(c: AnyColor | Colord, format: 'rgb', string?: false): RgbaColor;
export function convertColor(c: AnyColor | Colord, format: 'hsl', string?: false): HslaColor;
export function convertColor(c: AnyColor | Colord, format: ColorFormat, string?: boolean) {
	switch (format) {
		case 'rgb':
			return string ? colord(c).toRgbString() : colord(c).toRgb();
		case 'hex':
			return colord(c).toHex();
		case 'hsl':
			return string ? colord(c).toHslString() : colord(c).toHsl();
		default:
			return c;
	}
}

export function getColorFormat(color: string): ColorFormat | undefined {
	const format = getFormat(color);
	if (format === 'rgb' || format === 'hex' || format === 'hsl') {
		return format;
	}
	return undefined;
}

export function isValidColor(color: string) {
	return colord(color).isValid();
}

export function getChannelValue(channel: ColorChannel, value: AnyColor | Colord) {
	const c = colord(value);

	switch (channel) {
		case 'hue':
			return c.hue();
		case 'saturation':
			return c.toHsl().s;
		case 'lightness':
			return c.toHsl().l;
		case 'alpha':
			return c.alpha();
		case 'red':
			return c.toRgb().r;
		case 'green':
			return c.toRgb().g;
		case 'blue':
			return c.toRgb().b;
		default:
			return 0;
	}
}
