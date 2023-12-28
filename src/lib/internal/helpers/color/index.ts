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

export function sameColor(a: AnyColor | Colord, b: AnyColor | Colord) {
	return colord(a).isEqual(b);
}

type GetColorFromPosArgs = {
	pos: { x: number; y: number };
	hueAngle: number;
	value: string;
};

export function getColorFromPos({ pos, hueAngle, value }: GetColorFromPosArgs) {
	const x = pos.x;
	const y = 100 - pos.y;

	const c = colord({
		h: hueAngle,
		s: x,
		v: y,
		a: getChannelValue('alpha', value),
	});

	return convertColor(c, getColorFormat(value) ?? 'hex', true);
}

export const getColorPos = (color: string) => {
	const c = colord(color);
	const { s, v } = c.toHsv();

	return {
		x: s,
		y: 100 - v,
	};
};

type UltimateColor = Record<ColorChannel, number> & {
	format: ColorFormat;
};

export function ultimateColor(color: string) {
	const c = colord(color);

	const uc: UltimateColor = {
		hue: c.hue(),
		saturation: c.toHsl().s,
		lightness: c.toHsl().l,

		red: c.toRgb().r,
		green: c.toRgb().g,
		blue: c.toRgb().b,
		alpha: c.alpha(),

		format: getColorFormat(color) ?? 'hex',
	};

	function syncRGB(uc: UltimateColor) {
		const copied = { ...uc };
		const rgb = colord({ h: copied.hue, s: copied.saturation, l: copied.lightness }).toRgb();
		copied.red = rgb.r;
		copied.green = rgb.g;
		copied.blue = rgb.b;
		return copied;
	}

	function syncHSL(uc: UltimateColor) {
		const copied = { ...uc };
		const hsl = colord({ r: copied.red, g: copied.green, b: copied.blue }).toHsl();
		copied.hue = hsl.h;
		copied.saturation = hsl.s;
		copied.lightness = hsl.l;
		return copied;
	}

	function updateChannel(v: number, channel: ColorChannel): UltimateColor {
		const copied = { ...uc };

		switch (channel) {
			case 'hue': {
				copied.hue = v;
				return syncRGB(copied);
			}
			case 'saturation': {
				copied.saturation = v;
				return syncRGB(copied);
			}
			case 'lightness': {
				copied.lightness = v;
				return syncRGB(copied);
			}
			case 'red': {
				copied.red = v;
				return syncHSL(copied);
			}
			case 'green': {
				copied.green = v;
				return syncHSL(copied);
			}
			case 'blue': {
				copied.blue = v;
				return syncHSL(copied);
			}
			case 'alpha': {
				copied.alpha = v;
				return copied;
			}
		}
	}

	return { ...uc, updateChannel };
}

ultimateColor.isValid = (color: string) => colord(color).isValid();
