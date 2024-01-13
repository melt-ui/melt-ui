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
} from '$lib/internal/helpers/index.js';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import type { CreateScrollAreaProps, ScrollAreaType } from './types.js';
import type { Orientation, TextDirection } from '$lib/internal/types.js';
import type { Action } from 'svelte/action';
import {
	addUnlinkedScrollListener,
	debounceCallback,
	getScrollPositionFromPointer,
	getThumbOffsetFromScroll,
	getThumbRatio,
	getThumbSize,
	isScrollingWithinScrollbarBounds,
	resizeObserver,
	toInt,
	type Sizes,
} from './helpers.js';

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
	scrollAreaEl: Writable<HTMLElement | null>;
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
	handleThumbDown: (payload: { x: number; y: number }) => void;
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

	const scrollAreaEl = writable<HTMLElement | null>(null);
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
		scrollAreaEl,
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
		action: (node: HTMLElement) => {
			scrollAreaEl.set(node);
			return {
				destroy() {
					scrollAreaEl.set(null);
				},
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

		function getScrollbarActionByType(type: ScrollAreaType) {
			switch (type) {
				case 'always':
					return createBaseScrollbarAction;
				case 'auto':
					return createScrollbarAuto;
				case 'hover':
					return createScrollbarHover;
				default:
					return createBaseScrollbarAction;
			}
		}

		const scrollbarActionByType = getScrollbarActionByType(get(options.type));

		const scrollbar =
			orientationProp === 'horizontal'
				? createScrollbarX(rootState, scrollbarState, scrollbarActionByType)
				: createScrollbarY(rootState, scrollbarState, scrollbarActionByType);

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

	function handleDragScroll(e: MouseEvent, domRectProp?: DOMRect) {
		if (domRectProp) {
			const x = e.clientX - domRectProp.left;
			const y = e.clientY - domRectProp.top;
			if (get(isHorizontal)) {
				onDragScroll(x);
			} else {
				onDragScroll(y);
			}
		} else {
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
		handleDragScroll(e, currentTarget.getBoundingClientRect());
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

	function baseAction(node: HTMLElement) {
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
	}

	return {
		action: baseAction,
		visible: writable(true),
	};
}

function createScrollbarAuto(
	rootState: ScrollAreaRootState,
	scrollbarState: ScrollAreaScrollbarState
) {
	const visible = writable(false);
	const { viewportEl, contentEl } = rootState;
	const { isHorizontal } = scrollbarState;
	const { action } = createBaseScrollbarAction(rootState, scrollbarState);

	const handleResize = debounceCallback(() => {
		const $viewportEl = get(rootState.viewportEl);
		if ($viewportEl) {
			const isOverflowX = $viewportEl.offsetWidth < $viewportEl.scrollWidth;
			const isOverflowY = $viewportEl.offsetHeight < $viewportEl.scrollHeight;

			visible.set(get(isHorizontal) ? isOverflowX : isOverflowY);
		}
	}, 10);

	function scrollbarAutoAction(node: HTMLElement) {
		const unsubBaseAction = action(node)?.destroy;
		handleResize();
		const unsubObservers: Array<() => void> = [];

		const $viewportEl = get(viewportEl);
		if ($viewportEl) {
			unsubObservers.push(resizeObserver($viewportEl, handleResize));
		}
		const $contentEl = get(contentEl);
		if ($contentEl) {
			unsubObservers.push(resizeObserver($contentEl, handleResize));
		}

		return {
			destroy() {
				unsubObservers.forEach((unsub) => unsub());
				unsubBaseAction();
			},
		};
	}

	return {
		visible,
		action: scrollbarAutoAction,
	};
}

type CreateBaseAction = (
	rootState: ScrollAreaRootState,
	scrollbarState: ScrollAreaScrollbarState
) => { action: Action<HTMLElement>; visible: Writable<boolean> };

function createScrollbarHover(
	rootState: ScrollAreaRootState,
	scrollbarStart: ScrollAreaScrollbarState
) {
	let timeout: ReturnType<typeof setTimeout> | number | undefined;
	const { action } = createBaseScrollbarAction(rootState, scrollbarStart);
	const visible = writable(false);

	function handlePointerEnter() {
		window.clearTimeout(timeout);
		visible.set(true);
	}

	function handlePointerLeave() {
		timeout = window.setTimeout(() => {
			visible.set(false);
		}, get(rootState.options.hideDelay));
	}

	function scrollbarHoverAction(node: HTMLElement) {
		const scrollAreaEl = node.closest('[data-melt-scroll-area]');
		let unsubScrollAreaListeners = noop;
		if (scrollAreaEl) {
			unsubScrollAreaListeners = executeCallbacks(
				addEventListener(scrollAreaEl, 'pointerenter', handlePointerEnter),
				addEventListener(scrollAreaEl, 'pointerleave', handlePointerLeave)
			);
		}
		const unsubBaseAction = action(node)?.destroy;

		return {
			destroy() {
				unsubBaseAction?.();
				unsubScrollAreaListeners();
			},
		};
	}

	return {
		action: scrollbarHoverAction,
		visible,
	};
}

function createScrollbarX(
	rootState: ScrollAreaRootState,
	scrollbarState: ScrollAreaScrollbarState,
	createBaseAction: CreateBaseAction
) {
	const { dir } = rootState.options;
	const { sizes } = scrollbarState;
	const { action, visible } = createBaseAction(rootState, scrollbarState);

	return builder(name('scrollbar'), {
		stores: [sizes, dir, visible],
		returned: ([$sizes, $dir, $visible]) => {
			return {
				style: styleToString({
					position: 'absolute',
					bottom: 0,
					left: $dir === 'rtl' ? 'var(--melt-scroll-area-corner-width)' : 0,
					right: $dir === 'ltr' ? 'var(--melt-scroll-area-corner-width' : 0,
					'--melt-scroll-area-thumb-width': $sizes ? `${getThumbSize($sizes)}px` : undefined,
					display: $visible ? 'block' : 'none',
				}),
				'data-state': $visible ? 'visible' : 'hidden',
			};
		},
		action: (node: HTMLElement) => {
			const unsubBaseAction = action(node)?.destroy;
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
	createBaseAction: CreateBaseAction
) {
	const { dir } = rootState.options;
	const { sizes } = scrollbarState;
	const { action, visible } = createBaseAction(rootState, scrollbarState);

	return builder(name('scrollbar'), {
		stores: [sizes, dir, visible],
		returned: ([$sizes, $dir, $visible]) => {
			return {
				style: styleToString({
					position: 'absolute',
					top: 0,
					right: $dir === 'ltr' ? 0 : undefined,
					left: $dir === 'rtl' ? 0 : undefined,
					bottom: 'var(--melt-scroll-area-corner-height)',
					'--melt-scroll-area-thumb-height': $sizes ? `${getThumbSize($sizes)}px` : undefined,
					opacity: $visible ? 1 : 0,
				}),
				'data-state': $visible ? 'visible' : 'hidden',
			};
		},
		action: (node: HTMLElement) => {
			rootState.scrollbarYEl.set(node);
			rootState.scrollbarYEnabled.set(true);
			const unsubBaseAction = action(node)?.destroy;
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
		scrollbarState.handleThumbDown({ x, y });
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

			let effectHasRan = 0;
			let unsubViewportScroll = noop;

			effect([scrollbarState.sizes], ([_]) => {
				if (effectHasRan === 2) return;
				if ($viewportEl) {
					scrollbarState.onThumbPositionChange();
					unsubViewportScroll = addEventListener($viewportEl, 'scroll', handleScroll);
				}
				effectHasRan++;
			});

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
