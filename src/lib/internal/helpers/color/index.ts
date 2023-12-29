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
	updateChannel: (v: number, channel: ColorChannel) => UltimateColor;
	toString: () => string;
};

export function ultimateColor(color: string | UltimateColor): UltimateColor {
	let uc: UltimateColor;
	if (typeof color === 'string') {
		const c = colord(color);

		uc = {
			hue: c.hue(),
			saturation: c.toHsl().s,
			lightness: c.toHsl().l,
			red: c.toRgb().r,
			green: c.toRgb().g,
			blue: c.toRgb().b,
			alpha: c.alpha(),
			format: getColorFormat(color) ?? 'hex',
			updateChannel,
			toString,
		};
	} else {
		uc = {
			...color,
			updateChannel,
			toString,
		};
	}

	function syncRGB(uc: UltimateColor) {
		const rgb = colord({ h: uc.hue, s: uc.saturation, l: uc.lightness }).toRgb();
		uc.red = rgb.r;
		uc.green = rgb.g;
		uc.blue = rgb.b;
		return ultimateColor(uc);
	}

	function syncHSL(uc: UltimateColor) {
		const hsl = colord({ r: uc.red, g: uc.green, b: uc.blue }).toHsl();
		uc.hue = hsl.h;
		uc.saturation = hsl.s;
		uc.lightness = hsl.l;
		return ultimateColor(uc);
	}

	function updateChannel(v: number, channel: ColorChannel): UltimateColor {
		const copied = { ...uc };

		switch (channel) {
			case 'hue': {
				copied.hue = v;
				return syncRGB(copied);
			}
			case 'saturation': {
				copied.saturation = Math.round(v);
				return syncRGB(copied);
			}
			case 'lightness': {
				copied.lightness = Math.round(v);
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
				return ultimateColor(copied);
			}
		}
	}

	function toString() {
		switch (uc.format) {
			case 'hex': {
				return colord({ h: uc.hue, s: uc.saturation, l: uc.lightness, a: uc.alpha }).toHex();
			}
			case 'rgb': {
				if (uc.alpha === 1) {
					return `rgb(${uc.red}, ${uc.green}, ${uc.blue})`;
				} else {
					return `rgba(${uc.red}, ${uc.green}, ${uc.blue}, ${uc.alpha})`;
				}
			}
			case 'hsl': {
				if (uc.alpha === 1) {
					return `hsl(${uc.hue}, ${uc.saturation}%, ${uc.lightness}%)`;
				} else {
					return `hsla(${uc.hue}, ${uc.saturation}%, ${uc.lightness}%, ${uc.alpha})`;
				}
			}
		}
	}

	return { ...uc, updateChannel };
}

ultimateColor.isValid = (color: string) => colord(color).isValid();
