import {
	addEventListener,
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	isHTMLElement,
	noop,
	styleToString,
	toWritableStores,
	type ToWritableStores,
} from '$lib/internal/helpers';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import type { CreateScrollAreaProps } from './types';
import { safeOnDestroy } from '$lib/internal/helpers/lifecycle';
import type { Orientation, TextDirection } from '$lib/internal/types';
import type { Action } from 'svelte/action';

const defaults = {
	type: 'hover' as const,
	hideDelay: 600,
	dir: 'ltr' as const,
};

type ScrollAreaParts = 'root' | 'viewport' | 'content' | 'scrollbar' | 'thumb' | 'corner';
const { name } = createElHelpers<ScrollAreaParts>('scroll-area');

type ScrollAreaRootState = {
	cornerWidth: Writable<number>;
	cornerHeight: Writable<number>;
	scrollbarXEnabled: Writable<boolean>;
	scrollbarYEnabled: Writable<boolean>;
	scrollbarXEl: Writable<HTMLElement | null>;
	scrollbarYEl: Writable<HTMLElement | null>;
	viewportEl: Writable<HTMLElement | null>;
	contentEl: Writable<HTMLElement | null>;
	options: ToWritableStores<Required<CreateScrollAreaProps>>;
};

type ScrollAreaScrollbarState = {
	isHorizontal: Writable<boolean>;
	domRect: Writable<DOMRect | null>;
	prevWebkitUserSelect: Writable<string>;
	pointerOffset: Writable<number>;
	thumbEl: Writable<HTMLElement | null>;
	scrollbarEl: Writable<HTMLElement | null>;
	sizes: Writable<Sizes>;
	orientation: Writable<Orientation>;
	hasThumb: Readable<boolean>;
	handleWheelScroll: (e: WheelEvent, payload: number) => void;
	handleThumbDown: (e: MouseEvent, payload: { x: number; y: number }) => void;
	handleThumbUp: (e: MouseEvent) => void;
	onThumbPositionChange: () => void;
	onDragScroll: (payload: number) => void;
};

export function createScrollArea(props?: CreateScrollAreaProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores(withDefaults);

	const cornerWidth = writable(0);
	const cornerHeight = writable(0);
	const scrollbarXEnabled = writable(false);
	const scrollbarYEnabled = writable(false);

	const viewportEl = writable<HTMLElement | null>(null);
	const contentEl = writable<HTMLElement | null>(null);
	const scrollbarXEl = writable<HTMLElement | null>(null);
	const scrollbarYEl = writable<HTMLElement | null>(null);

	const rootState: ScrollAreaRootState = {
		cornerWidth,
		cornerHeight,
		scrollbarXEnabled,
		scrollbarYEnabled,
		viewportEl,
		contentEl,
		options,
		scrollbarXEl,
		scrollbarYEl,
	};

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
		action: (node: HTMLElement) => {
			const styleNode = document.createElement('style');
			styleNode.innerHTML = `
				/* Hide scrollbars cross-browser and enable momentum scroll for touch
					devices */
				[data-melt-scroll-area-viewport] {
					scrollbar-width:none;
					-ms-overflow-style:none;
					-webkit-overflow-scrolling:touch;
				}

				[data-melt-scroll-area-viewport]::-webkit-scrollbar {
					display:none;
				}
			`;

			node.parentElement?.insertBefore(styleNode, node);

			viewportEl.set(node);

			return {
				destroy() {
					styleNode.remove();
					viewportEl.set(null);
				},
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
		action: (node: HTMLElement) => {
			contentEl.set(node);
			return {
				destroy() {
					contentEl.set(null);
				},
			};
		},
	});

	function createScrollbar(orientationProp: Orientation = 'vertical') {
		const orientation = writable(orientationProp);
		const isHorizontal = writable(orientationProp === 'horizontal');
		const domRect = writable<DOMRect | null>(null);
		const prevWebkitUserSelect = writable('');
		const pointerOffset = writable(0);
		const thumbEl = writable<HTMLElement | null>(null);
		const scrollbarEl = writable<HTMLElement | null>(null);
		const sizes = writable<Sizes>({
			content: 0,
			viewport: 0,
			scrollbar: {
				size: 0,
				paddingStart: 0,
				paddingEnd: 0,
			},
		});

		const hasThumb = derived(sizes, ($sizes) => {
			const thumbRatio = getThumbRatio($sizes.viewport, $sizes.content);
			return Boolean(thumbRatio > 0 && thumbRatio < 1);
		});

		function getScrollPosition(pointerPos: number, dir?: TextDirection) {
			return getScrollPositionFromPointer(pointerPos, get(pointerOffset), get(sizes), dir);
		}

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

		function onThumbPositionChange() {
			const $viewportEl = get(viewportEl);
			const $thumbEl = get(thumbEl);
			if (!$viewportEl || !$thumbEl) return;
			if (get(isHorizontal)) {
				const scrollPos = $viewportEl.scrollLeft;
				const offset = getThumbOffsetFromScroll(scrollPos, get(sizes), get(rootState.options.dir));
				$thumbEl.style.transform = `translate3d(${offset}px, 0, 0)`;
			} else {
				const scrollPos = $viewportEl.scrollTop;
				const offset = getThumbOffsetFromScroll(scrollPos, get(sizes), get(rootState.options.dir));
				$thumbEl.style.transform = `translate3d(0, ${offset}px, 0)`;
			}
		}

		function onDragScroll(payload: number) {
			const $viewportEl = get(viewportEl);
			if (!$viewportEl) return;
			if (get(isHorizontal)) {
				$viewportEl.scrollLeft = getScrollPosition(payload, get(rootState.options.dir));
			} else {
				$viewportEl.scrollTop = getScrollPosition(payload);
			}
		}

		const scrollbarState: ScrollAreaScrollbarState = {
			isHorizontal,
			domRect,
			prevWebkitUserSelect,
			pointerOffset,
			thumbEl,
			sizes,
			orientation,
			handleThumbDown,
			handleThumbUp,
			onThumbPositionChange,
			onDragScroll,
			handleWheelScroll,
			hasThumb,
			scrollbarEl,
		};

		const scrollbar =
			orientationProp === 'horizontal'
				? createScrollbarX(rootState, scrollbarState, createBaseScrollbarAction)
				: createScrollbarY(rootState, scrollbarState, createBaseScrollbarAction);

		const thumb = createScrollbarThumb(rootState, scrollbarState);

		return {
			elements: {
				scrollbar,
				thumb,
			},
		};
	}

	const corner = createScrollAreaCorner(rootState);

	return {
		options,
		elements: {
			root,
			viewport,
			content,
			corner,
		},
		builders: {
			createScrollbar,
		},
	};
}

function createBaseScrollbarAction(
	rootState: ScrollAreaRootState,
	scrollbarState: ScrollAreaScrollbarState
) {
	const { viewportEl, contentEl } = rootState;
	const { domRect, onDragScroll, isHorizontal, prevWebkitUserSelect, sizes, handleWheelScroll } =
		scrollbarState;

	const scrollbarEl = writable<HTMLElement | null>(null);

	function handleDragScroll(e: MouseEvent) {
		const $domRect = get(domRect);
		if ($domRect) {
			const x = e.clientX - $domRect.left;
			const y = e.clientY - $domRect.top;
			if (get(isHorizontal)) {
				onDragScroll(x);
			} else {
				onDragScroll(y);
			}
		}
	}

	function handlePointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		const target = e.target;
		if (!isHTMLElement(target)) return;
		target.setPointerCapture(e.pointerId);
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;
		domRect.set(currentTarget.getBoundingClientRect());
		prevWebkitUserSelect.set(document.body.style.webkitUserSelect);
		document.body.style.webkitUserSelect = 'none';
		const $viewportEl = get(viewportEl);
		if ($viewportEl) {
			$viewportEl.style.scrollBehavior = 'auto';
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
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const isScrollbarWheel = currentTarget.contains(target);
		if (!isScrollbarWheel) return;

		const $sizes = get(sizes);
		if (!$sizes) return;
		const maxScrollPos = $sizes.content - $sizes.viewport;
		handleWheelScroll(e, maxScrollPos);
	}

	function handleSizeChange() {
		const $scrollbarEl = get(scrollbarEl);
		if (!$scrollbarEl) return;
		const $isHorizontal = get(isHorizontal);
		const $viewportEl = get(viewportEl);
		if ($isHorizontal) {
			sizes.set({
				content: $viewportEl?.scrollWidth ?? 0,
				viewport: $viewportEl?.offsetWidth ?? 0,
				scrollbar: {
					size: $scrollbarEl.clientWidth ?? 0,
					paddingStart: toInt(getComputedStyle($scrollbarEl).paddingLeft),
					paddingEnd: toInt(getComputedStyle($scrollbarEl).paddingRight),
				},
			});
		} else {
			sizes.set({
				content: $viewportEl?.scrollHeight ?? 0,
				viewport: $viewportEl?.offsetHeight ?? 0,
				scrollbar: {
					size: $scrollbarEl.clientHeight ?? 0,
					paddingStart: toInt(getComputedStyle($scrollbarEl).paddingLeft),
					paddingEnd: toInt(getComputedStyle($scrollbarEl).paddingRight),
				},
			});
		}
	}

	return (node: HTMLElement) => {
		scrollbarEl.set(node);
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'pointerdown', handlePointerDown),
			addMeltEventListener(node, 'pointermove', handlePointerMove),
			addMeltEventListener(node, 'pointerup', handlePointerUp),
			addEventListener(document, 'wheel', handleWheel, { passive: false })
		);

		const unsubResizeContent = effect([contentEl], ([$contentEl]) => {
			if (!$contentEl) return noop;
			return resizeObserver($contentEl, handleSizeChange);
		});

		return {
			destroy() {
				unsubEvents();
				unsubResizeContent();
			},
		};
	};
}

function createScrollbarX(
	rootState: ScrollAreaRootState,
	scrollbarState: ScrollAreaScrollbarState,
	createBaseAction: (
		rootState: ScrollAreaRootState,
		scrollbarState: ScrollAreaScrollbarState
	) => Action<HTMLElement>
) {
	const { dir } = rootState.options;
	const { sizes } = scrollbarState;

	return builder(name('scrollbar'), {
		stores: [sizes, dir],
		returned: ([$sizes, $dir]) => {
			return {
				style: styleToString({
					position: 'absolute',
					bottom: 0,
					left: $dir === 'rtl' ? 'var(--melt-scroll-area-corner-width)' : 0,
					right: $dir === 'ltr' ? 'var(--melt-scroll-area-corner-width' : 0,
					'--melt-scroll-area-thumb-width': $sizes ? `${getThumbSize($sizes)}px` : undefined,
				}),
			};
		},
		action: (node: HTMLElement) => {
			const baseAction = createBaseAction(rootState, scrollbarState);
			const unsubBaseAction = baseAction(node)?.destroy;
			rootState.scrollbarXEl.set(node);
			rootState.scrollbarXEnabled.set(true);
			return {
				destroy() {
					unsubBaseAction?.();
					rootState.scrollbarXEl.set(null);
				},
			};
		},
	});
}

function createScrollbarY(
	rootState: ScrollAreaRootState,
	scrollbarState: ScrollAreaScrollbarState,
	createBaseAction: (
		rootState: ScrollAreaRootState,
		scrollbarState: ScrollAreaScrollbarState
	) => Action<HTMLElement>
) {
	const { dir } = rootState.options;
	const { sizes } = scrollbarState;

	return builder(name('scrollbar'), {
		stores: [sizes, dir],
		returned: ([$sizes, $dir]) => {
			return {
				style: styleToString({
					position: 'absolute',
					top: 0,
					right: $dir === 'ltr' ? 0 : undefined,
					left: $dir === 'rtl' ? 0 : undefined,
					bottom: 'var(--melt-scroll-area-corner-height)',
					'--melt-scroll-area-thumb-height': $sizes ? `${getThumbSize($sizes)}px` : undefined,
				}),
			};
		},
		action: (node: HTMLElement) => {
			const baseAction = createBaseAction(rootState, scrollbarState);
			const unsubBaseAction = baseAction(node)?.destroy;
			rootState.scrollbarYEl.set(node);
			rootState.scrollbarYEnabled.set(true);
			return {
				destroy() {
					unsubBaseAction?.();
					rootState.scrollbarYEl.set(null);
				},
			};
		},
	});
}

function createScrollbarThumb(
	rootState: ScrollAreaRootState,
	scrollbarState: ScrollAreaScrollbarState
) {
	function handlePointerDown(e: MouseEvent) {
		const thumb = e.target;
		if (!isHTMLElement(thumb)) return;
		const thumbRect = thumb.getBoundingClientRect();
		const x = e.clientX - thumbRect.left;
		const y = e.clientY - thumbRect.top;
		scrollbarState.handleThumbDown(e, { x, y });
	}

	function handlePointerUp(e: MouseEvent) {
		scrollbarState.handleThumbUp(e);
	}

	let listener: (() => void) | undefined = undefined;

	function handleScroll() {
		const $viewportEl = get(rootState.viewportEl);
		if (listener || !$viewportEl) return;
		listener = addUnlinkedScrollListener($viewportEl, scrollbarState.onThumbPositionChange);
		scrollbarState.onThumbPositionChange();
	}

	const thumb = builder(name('thumb'), {
		stores: [scrollbarState.hasThumb],
		returned: ([$hasThumb]) => {
			return {
				style: styleToString({
					width: 'var(--melt-scroll-area-thumb-width)',
					height: 'var(--melt-scroll-area-thumb-height)',
				}),
				'data-state': $hasThumb ? 'visible' : 'hidden',
			};
		},
		action: (node: HTMLElement) => {
			scrollbarState.thumbEl.set(node);
			const $viewportEl = get(rootState.viewportEl);
			let unsubViewportScroll = noop;
			if ($viewportEl) {
				scrollbarState.onThumbPositionChange();
				unsubViewportScroll = addEventListener($viewportEl, 'scroll', handleScroll);
			}

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', handlePointerDown),
				addMeltEventListener(node, 'pointerup', handlePointerUp)
			);

			return {
				destroy() {
					unsubViewportScroll();
					unsubEvents();
				},
			};
		},
	});

	return thumb;
}

function createScrollAreaCorner(rootState: ScrollAreaRootState) {
	const width = writable(0);
	const height = writable(0);

	const hasSize = derived([width, height], ([$width, $height]) => !!$width && !!$height);

	function setCornerHeight() {
		const offsetHeight = get(rootState.scrollbarXEl)?.offsetHeight || 0;
		rootState.cornerHeight.set(offsetHeight);
		height.set(offsetHeight);
	}

	function setCornerWidth() {
		const offsetWidth = get(rootState.scrollbarYEl)?.offsetWidth || 0;
		rootState.cornerWidth.set(offsetWidth);
		width.set(offsetWidth);
	}

	effect([rootState.scrollbarXEl], ([$scrollbarXEl]) => {
		if ($scrollbarXEl) {
			setCornerHeight();
		}
	});

	effect([rootState.scrollbarYEl], ([$scrollbarYEl]) => {
		if ($scrollbarYEl) {
			setCornerWidth();
		}
	});

	const hasBothScrollbarsVisible = derived(
		[rootState.scrollbarXEl, rootState.scrollbarYEl],
		([$scrollbarXEl, $scrollbarYEl]) => {
			return !!$scrollbarXEl && !!$scrollbarYEl;
		}
	);

	const hasCorner = derived(
		[rootState.options.type, hasBothScrollbarsVisible],
		([$type, $hasBoth]) => {
			return $type !== 'scroll' && $hasBoth;
		}
	);

	const shouldDisplay = derived(
		[hasCorner, hasSize],
		([$hasCorner, $hasSize]) => $hasCorner && $hasSize
	);

	const corner = builder(name('corner'), {
		stores: [width, height, rootState.options.dir, shouldDisplay],
		returned: ([$width, $height, $dir, $shouldDisplay]) => {
			return {
				style: styleToString({
					display: $shouldDisplay ? 'block' : 'none',
					width: `${$width}px`,
					height: `${$height}px`,
					position: 'absolute',
					right: $dir === 'ltr' ? 0 : undefined,
					left: $dir === 'rtl' ? 0 : undefined,
					bottom: 0,
				}),
			};
		},
	});

	return corner;
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
