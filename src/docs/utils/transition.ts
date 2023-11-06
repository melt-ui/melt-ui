import { styleToString } from '$lib/internal/helpers/index.js';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
	const [minA, maxA] = scaleA;
	const [minB, maxB] = scaleB;

	const percentage = (valueA - minA) / (maxA - minA);
	const valueB = percentage * (maxB - minB) + minB;

	return valueB;
};

type FlyAndScaleOptions = {
	y: number;
	start: number;
	duration?: number;
};

export const flyAndScale = (node: HTMLElement, options: FlyAndScaleOptions): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	return {
		duration: options.duration ?? 150,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [options.y, 0]);
			const scale = scaleConversion(t, [0, 1], [options.start, 1]);

			return styleToString({
				transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
				opacity: t,
			});
		},
		easing: cubicOut,
	};
};
export function split_css_unit(value: number | string): [number, string] {
	const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return split ? [parseFloat(split[1]), split[2] || 'px'] : ([value, 'px'] as [number, string]);
}

export function customFly(
	node: HTMLElement,
	{ delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}
): TransitionConfig {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;
	const od = target_opacity * (1 - opacity);
	const [xValue, xUnit] = split_css_unit(x);
	const [yValue, yUnit] = split_css_unit(y);
	const xDrag = node.style.getPropertyValue('--melt-toast-swipe-end-x');
	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * xValue - Number(xDrag)}${xUnit}, ${
			(1 - t) * yValue
		}${yUnit});
			opacity: ${target_opacity - od * u}`,
	};
}
