import {
	builder,
	createElHelpers,
	effect,
	noop,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers';
import { writable, type Writable } from 'svelte/store';
import type { CreateScrollAreaProps } from './types';
import { safeOnDestroy, safeOnMount } from '$lib/internal/helpers/lifecycle';

const defaults = {
	type: 'hover' as const,
	hideDelay: 600,
	dir: 'ltr' as const,
};

type ScrollAreaParts = 'root' | 'viewport' | 'content' | 'scrollbar' | 'thumb';
const { name } = createElHelpers<ScrollAreaParts>('scroll-area');

export function createScrollArea(props?: CreateScrollAreaProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores(withDefaults);
	const { type, hideDelay, dir } = options;

	type ScrollAreaState = {
		cornerWidth: number;
		cornerHeight: number;
		scrollbarXEnabled: boolean;
		scrollbarYEnabled: boolean;
	};

	const cornerWidth = writable(0);
	const cornerHeight = writable(0);
	const scrollbarXEnabled = writable(false);
	const scrollbarYEnabled = writable(false);

	const viewportEl = writable<HTMLElement | null>(null);
	const contentEl = writable<HTMLElement | null>(null);

	const root = builder(name(), {
		stores: [cornerWidth, cornerHeight],
		returned: ([$cornerWidth, $cornderHeight]) => {
			return {
				style: styleToString({
					position: 'relative',
					'--melt-scroll-area-corner-width': `${$cornerWidth}px`,
					'--melt-scroll-area-corner-height': `${$cornderHeight}px`,
				}),
			};
		},
	});

	const viewport = builder(name('viewport'), {
		stores: [scrollbarXEnabled, scrollbarYEnabled],
		returned: ([$scrollbarXEnabled, $scrollbarYEnabled]) => {
			return {
				style: styleToString({
					'scrollbar-width': 'none',
					'-ms-overflow-style': 'none',
					'-webkit-overflow-scrolling': 'touch',
					'-webkit-scrollbar': 'none',
					'overflow-x': $scrollbarXEnabled ? 'scroll' : 'hidden',
					'overflow-y': $scrollbarYEnabled ? 'scroll' : 'hidden',
				}),
			};
		},
	});

	const content = builder(name('content'), {
		returned: () => {
			return {
				style: styleToString({
					'min-width': '100%',
					display: 'table',
				}),
			};
		},
	});

	return {
		options,
	};
}

type Sizes = {
	content: number;
	viewport: number;
	scrollbar: {
		size: number;
		paddingStart: number;
		paddingEnd: number;
	};
};

function debounceCallback(cb: () => void, delay: number) {
	let debounceTimer = 0;

	safeOnDestroy(() => {
		clearTimeout(debounceTimer);
	});

	return () => {
		window.clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(cb, delay);
	};
}

function resizeObserver(node: HTMLElement, handleResize: () => void) {
	let animationFrame = 0;

	const observer = new ResizeObserver(() => {
		cancelAnimationFrame(animationFrame);
		animationFrame = requestAnimationFrame(handleResize);
	});

	observer.observe(node);

	return () => {
		window.cancelAnimationFrame(animationFrame);
		observer.unobserve(node);
	};
}

function addUnlinkedScrollListener(node: HTMLElement, handler = noop) {
	let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
	let animationFrame = 0;
	(function loop() {
		const position = { left: node.scrollLeft, top: node.scrollTop };
		const isHorizontalScroll = prevPosition.left !== position.left;
		const isVerticalScroll = prevPosition.top !== position.top;
		if (isHorizontalScroll || isVerticalScroll) {
			handler();
		}
		prevPosition = position;
		animationFrame = requestAnimationFrame(loop);
	})();

	return () => window.cancelAnimationFrame(animationFrame);
}

function isScrollingWithinScrollbarBounds(scrollPos: number, maxScrollPos: number) {
	return scrollPos > 0 && scrollPos < maxScrollPos;
}

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
function linearScale(input: readonly [number, number], output: readonly [number, number]) {
	return (value: number) => {
		if (input[0] === input[1] || output[0] === output[1]) return output[0];
		const ratio = (output[1] - output[0]) / (input[1] - input[0]);
		return output[0] + ratio * (value - input[0]);
	};
}

function toInt(value?: string) {
	return value ? parseInt(value, 10) : 0;
}

function getThumbRatio(viewportSize: number, contentSize: number) {
	const ratio = viewportSize / contentSize;
	return isNaN(ratio) ? 0 : ratio;
}

function getThumbSize(sizes: Sizes) {
	const ratio = getThumbRatio(sizes.viewport, sizes.content);
	const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
	const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
	// minimum of 18 matches macOS minimum
	return Math.max(thumbSize, 18);
}

function getScrollPositionFromPointer(
	pointerPos: number,
	pointerOffset: number,
	sizes: Sizes,
	dir: Direction = 'ltr'
) {
	const thumbSizePx = getThumbSize(sizes);
	const thumbCenter = thumbSizePx / 2;
	const offset = pointerOffset || thumbCenter;
	const thumbOffsetFromEnd = thumbSizePx - offset;
	const minPointerPos = sizes.scrollbar.paddingStart + offset;
	const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
	const maxScrollPos = sizes.content - sizes.viewport;
	const scrollRange = dir === 'ltr' ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
	const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange as [number, number]);
	return interpolate(pointerPos);
}

function getThumbOffsetFromScroll(scrollPos: number, sizes: Sizes, dir: Direction = 'ltr') {
	const thumbSizePx = getThumbSize(sizes);
	const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
	const scrollbar = sizes.scrollbar.size - scrollbarPadding;
	const maxScrollPos = sizes.content - sizes.viewport;
	const maxThumbPos = scrollbar - thumbSizePx;
	const scrollClampRange = dir === 'ltr' ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
	const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange as [number, number]);
	const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
	return interpolate(scrollWithoutMomentum);
}
