import { scaleFactoryBand, scaleFactoryLinear } from './scale.js';
import type { Area } from './types-basic.js';

export const h_range = ({ area }: { area: Area}) => [0, area.padding.inner.width] as [number, number];

export const h_band = {
	discrete: true,
	range: h_range,
	scaleFactory: scaleFactoryBand<string>
} as const;

export const h_linear = {
	range: h_range,
	scaleFactory: scaleFactoryLinear<number>
} as const

export const v_range = ({ area }: { area: Area}) => [0, area.padding.inner.height] as [number, number];

export const v_band = {
	discrete: true as const,
	range: v_range,
	reverse: true,
	scaleFactory: scaleFactoryBand<string>
} as const

export const v_linear = {
	range: v_range,
	reverse: true,
	scaleFactory: scaleFactoryLinear<number>
} as const
