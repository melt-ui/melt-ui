import {
	addEventListener,
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateId,
	isHTMLElement,
	noop,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers';
import { derived, get, writable, type Writable } from 'svelte/store';
import type { CreateScrollAreaProps, ScrollAreaType } from './types';
import { safeOnDestroy, safeOnMount } from '$lib/internal/helpers/lifecycle';
import type { Orientation, TextDirection } from '$lib/internal/types';

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
	const scrollbarEl = writable<HTMLElement | null>(null);

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

	const scrollbar = builder(name('scrollbar'), {
		stores: [],
		returned: () => {
			return (orientation: Orientation = 'vertical') => {
				return {
					style: styleToString({
						'data-orientation': orientation,
					}),
				};
			};
		},
	});

	function createScrollbar(orientationProp: Orientation = 'vertical', node: HTMLElement) {
		const orientation = writable(orientationProp);
		const isHorizontal = writable(orientationProp === 'horizontal');
		const domRect = writable<DOMRect | null>(null);
		const prevWebkitUserSelect = writable('');
		const pointerOffset = writable(0);
		const thumbEl = writable<HTMLElement | null>(null);
		const sizes = writable<Sizes>({
			content: 0,
			viewport: 0,
			scrollbar: {
				size: 0,
				paddingStart: 0,
				paddingEnd: 0,
			},
		});

		function handleWheelScroll(e: WheelEvent, payload: number) {
			const $viewportEl = get(viewportEl);
			if (!$viewportEl) return;
			if (get(isHorizontal)) {
				const scrollPos = $viewportEl.scrollLeft + e.deltaY;

				$viewportEl.scrollLeft = scrollPos;

				if (isScrollingWithinScrollbarBounds(scrollPos, payload)) {
					e.preventDefault();
				}
			} else {
				const scrollPos = $viewportEl.scrollTop + e.deltaY;

				$viewportEl.scrollTop = scrollPos;

				if (isScrollingWithinScrollbarBounds(scrollPos, payload)) {
					e.preventDefault();
				}
			}
		}

		function handleThumbDown(payload: { x: number; y: number }) {
			if (get(isHorizontal)) {
				pointerOffset.set(payload.x);
			} else {
				pointerOffset.set(payload.y);
			}
		}

		function handleThumbUp() {
			pointerOffset.set(0);
		}

		function getScrollPosition(pointerPos: number, dir?: TextDirection) {
			return getScrollPositionFromPointer(pointerPos, get(pointerOffset), get(sizes), dir);
		}

		function handleDragScroll(e: MouseEvent) {
			const $domRect = get(domRect);
			if ($domRect) {
				const x = e.clientX - $domRect.left;
				const y = e.clientY - $domRect.top;
				// TODO: dispatch dragScroll
			}
		}

		function handlePointerDown(e: PointerEvent) {
			const mainPointer = 0;
			if (e.button === mainPointer) {
				const target = e.target;
				if (!isHTMLElement(target)) return;
				target.setPointerCapture(e.pointerId);
				domRect.set(node.getBoundingClientRect());

				prevWebkitUserSelect.set(document.body.style.webkitUserSelect);
				document.body.style.webkitUserSelect = 'none';

				const $viewportEl = get(viewportEl);
				if ($viewportEl) {
					$viewportEl.style.scrollBehavior = 'auto';
				}

				handleDragScroll(e);
			}
		}

		function handlePointerMove(e: PointerEvent) {
			handleDragScroll(e);
		}

		function handlePointerUp(e: PointerEvent) {
			const target = e.target;
			if (!isHTMLElement(target)) return;
			if (target.hasPointerCapture(e.pointerId)) {
				target.releasePointerCapture(e.pointerId);
			}

			document.body.style.webkitUserSelect = get(prevWebkitUserSelect);
			const $viewportEl = get(viewportEl);
			if ($viewportEl) {
				$viewportEl.style.scrollBehavior = '';
			}
			domRect.set(null);
		}

		function handleWheel(e: WheelEvent) {
			const target = e.target;
			if (!isHTMLElement(target)) return;
			const $scrollbarEl = get(scrollbarEl);
			if (!$scrollbarEl) return;
			const isScrollbarWheel = $scrollbarEl.contains(target);
			const $sizes = get(sizes);
			const maxScrollWheelPos = $sizes.content - $sizes.viewport;
			if (isScrollbarWheel) {
				handleWheelScroll(e, maxScrollWheelPos);
			}
		}

		function handleSizeChange() {
			const $scrollbarEl = get(scrollbarEl);
			const $viewportEl = get(viewportEl);
			if (!$scrollbarEl || !$viewportEl) return;
			if (get(isHorizontal)) {
				sizes.set({
					content: $viewportEl.scrollWidth,
					viewport: $viewportEl.offsetWidth,
					scrollbar: {
						size: $scrollbarEl.clientWidth,
						paddingStart: toInt(getComputedStyle($scrollbarEl).paddingLeft),
						paddingEnd: toInt(getComputedStyle($scrollbarEl).paddingRight),
					},
				});
			} else {
				sizes.set({
					content: $viewportEl.scrollHeight,
					viewport: $viewportEl.offsetHeight,
					scrollbar: {
						size: $scrollbarEl.clientHeight,
						paddingStart: toInt(getComputedStyle($scrollbarEl).paddingLeft),
						paddingEnd: toInt(getComputedStyle($scrollbarEl).paddingRight),
					},
				});
			}
		}

		function baseScrollbarAction(node: HTMLElement) {
			scrollbarEl.set(node);

			const unsubDocumentEvents = executeCallbacks(
				addEventListener(document, 'wheel', handleWheel, { passive: false }),
				addEventListener(node, 'wheel', handleWheel)
			);
			const unsubScrollbarEvents = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', handlePointerDown),
				addMeltEventListener(node, 'pointermove', handlePointerMove),
				addMeltEventListener(node, 'pointerup', handlePointerUp)
			);

			const unsubContentResize = effect([contentEl], ([$contentEl]) => {
				if (!$contentEl) return noop;
				return resizeObserver($contentEl, handleSizeChange);
			});

			const unsubScrollbarResize = resizeObserver(node, handleSizeChange);

			return {
				destroy() {
					unsubDocumentEvents();
					unsubScrollbarEvents();
					unsubContentResize();
					unsubScrollbarResize();
				},
			};
		}

		effect([isHorizontal], ([$isHorizontal]) => {
			if ($isHorizontal) {
				scrollbarXEnabled.set(true);
			} else {
				scrollbarYEnabled.set(true);
			}

			return () => {
				if ($isHorizontal) {
					scrollbarXEnabled.set(false);
				} else {
					scrollbarYEnabled.set(false);
				}
			};
		});
	}

	return {
		options,
		elements: {
			root,
			viewport,
			content,
		},
	};
}

function getOrientation(node: HTMLElement) {
	const orientation = node.getAttribute('data-orientation');
	return orientation === 'horizontal' ? 'horizontal' : 'vertical';
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
	dir: TextDirection = 'ltr'
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

function clamp(value: number, [min, max]: [number, number]): number {
	return Math.min(max, Math.max(min, value));
}

function getThumbOffsetFromScroll(scrollPos: number, sizes: Sizes, dir: TextDirection = 'ltr') {
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
