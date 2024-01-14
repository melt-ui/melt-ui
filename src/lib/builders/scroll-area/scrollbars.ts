import { name, type ScrollAreaState } from './create.js';
import type { Action } from 'svelte/action';
import { get } from 'svelte/store';
import { debounceCallback, getThumbSize, resizeObserver, toInt } from './helpers.js';
import {
	executeCallbacks,
	noop,
	addEventListener,
	addMeltEventListener,
	builder,
	effect,
	sleep,
	styleToString,
	isHTMLElement,
} from '$lib/internal/helpers/index.js';
import type { ScrollAreaType } from './types.js';
import { createStateMachine } from '$lib/internal/helpers/store/stateMachine.js';

export type CreateScrollbarAction = (state: ScrollAreaState) => Action<HTMLElement>;

/**
 * The base scrollbar action is used for all scrollbar types,
 * and provides the basic functionality for dragging the scrollbar
 * thumb and scrolling the content.
 *
 * The other scrollbar actions will extend this one, preventing a ton
 * of code duplication.
 */
export function createBaseScrollbarAction(state: ScrollAreaState) {
	const { rootState, scrollbarState } = state;
	scrollbarState.isVisible.set(true);

	function handleDragScroll(e: MouseEvent) {
		const $domRect = get(scrollbarState.domRect);
		if ($domRect) {
			const x = e.clientX - $domRect.left;
			const y = e.clientY - $domRect.top;
			if (get(scrollbarState.isHorizontal)) {
				scrollbarState.onDragScroll(x);
			} else {
				scrollbarState.onDragScroll(y);
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
		scrollbarState.domRect.set(currentTarget.getBoundingClientRect());
		scrollbarState.prevWebkitUserSelect.set(document.body.style.webkitUserSelect);
		document.body.style.webkitUserSelect = 'none';
		const $viewportEl = get(rootState.viewportEl);
		if ($viewportEl) {
			$viewportEl.style.scrollBehavior = 'auto';
		}
		handleDragScroll(e);
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
		document.body.style.webkitUserSelect = get(scrollbarState.prevWebkitUserSelect);
		const $viewportEl = get(rootState.viewportEl);
		if ($viewportEl) {
			$viewportEl.style.scrollBehavior = '';
		}
		scrollbarState.domRect.set(null);
	}

	function handleWheel(e: WheelEvent) {
		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const isScrollbarWheel = currentTarget.contains(target);
		if (!isScrollbarWheel) return;

		const $sizes = get(scrollbarState.sizes);
		if (!$sizes) return;
		const maxScrollPos = $sizes.content - $sizes.viewport;
		scrollbarState.handleWheelScroll(e, maxScrollPos);
	}

	function handleSizeChange() {
		const $scrollbarEl = get(scrollbarState.scrollbarEl);
		if (!$scrollbarEl) return;
		const $isHorizontal = get(scrollbarState.isHorizontal);
		const $viewportEl = get(rootState.viewportEl);
		if ($isHorizontal) {
			scrollbarState.sizes.set({
				content: $viewportEl?.scrollWidth ?? 0,
				viewport: $viewportEl?.offsetWidth ?? 0,
				scrollbar: {
					size: $scrollbarEl.clientWidth ?? 0,
					paddingStart: toInt(getComputedStyle($scrollbarEl).paddingLeft),
					paddingEnd: toInt(getComputedStyle($scrollbarEl).paddingRight),
				},
			});
		} else {
			scrollbarState.sizes.set({
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

	// We need to recompute the sizes when the visibility of
	// the scrollbar changes
	effect([scrollbarState.isVisible], ([_]) => {
		sleep(1).then(() => handleSizeChange());
	});

	function baseAction(node: HTMLElement) {
		scrollbarState.scrollbarEl.set(node);
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'pointerdown', handlePointerDown),
			addMeltEventListener(node, 'pointermove', handlePointerMove),
			addMeltEventListener(node, 'pointerup', handlePointerUp),
			addEventListener(document, 'wheel', handleWheel, { passive: false })
		);

		const unsubResizeContent = effect([rootState.contentEl], ([$contentEl]) => {
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

	return baseAction;
}

/**
 * The auto scrollbar action will show the scrollbar when the content
 * overflows the viewport, and hide it when it doesn't.
 */
export function createAutoScrollbarAction(state: ScrollAreaState) {
	// always create the base action first, so we can override any
	// state mutations that occur there
	const baseAction = createBaseScrollbarAction(state);
	const { rootState, scrollbarState } = state;

	const handleResize = debounceCallback(() => {
		const $viewportEl = get(rootState.viewportEl);
		if ($viewportEl) {
			const isOverflowX = $viewportEl.offsetWidth < $viewportEl.scrollWidth;
			const isOverflowY = $viewportEl.offsetHeight < $viewportEl.scrollHeight;

			scrollbarState.isVisible.set(get(scrollbarState.isHorizontal) ? isOverflowX : isOverflowY);
		}
	}, 10);

	function scrollbarAutoAction(node: HTMLElement) {
		const unsubBaseAction = baseAction(node)?.destroy;
		handleResize();
		const unsubObservers: Array<() => void> = [];

		const $viewportEl = get(rootState.viewportEl);
		if ($viewportEl) {
			unsubObservers.push(resizeObserver($viewportEl, handleResize));
		}
		const $contentEl = get(rootState.contentEl);
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

	return scrollbarAutoAction;
}

/**
 * The hover scrollbar action will show the scrollbar when the user
 * hovers over the scroll area, and hide it when they leave after
 * an optionally specified delay.
 */
export function createHoverScrollbarAction(state: ScrollAreaState) {
	// always create the base action first, so we can override any
	// state mutations that occur there
	const baseAction = createBaseScrollbarAction(state);
	const { rootState, scrollbarState } = state;

	// with the hover scrollbar, we want it to be hidden by default
	// and only show it when the user hovers over the scroll area
	scrollbarState.isVisible.set(false);

	let timeout: ReturnType<typeof setTimeout> | number | undefined;

	function handlePointerEnter() {
		window.clearTimeout(timeout);
		scrollbarState.isVisible.set(true);
	}

	function handlePointerLeave() {
		timeout = window.setTimeout(() => {
			scrollbarState.isVisible.set(false);
		}, get(rootState.options.hideDelay));
	}

	function scrollbarHoverAction(node: HTMLElement) {
		const unsubBaseAction = baseAction(node)?.destroy;
		const scrollAreaEl = node.closest('[data-melt-scroll-area]');
		let unsubScrollAreaListeners = noop;
		if (scrollAreaEl) {
			unsubScrollAreaListeners = executeCallbacks(
				addEventListener(scrollAreaEl, 'pointerenter', handlePointerEnter),
				addEventListener(scrollAreaEl, 'pointerleave', handlePointerLeave)
			);
		}

		return {
			destroy() {
				unsubBaseAction?.();
				unsubScrollAreaListeners();
			},
		};
	}

	return scrollbarHoverAction;
}

/**
 * The scroll scrollbar action will only show the scrollbar
 * when the user is actively scrolling the content.
 */
export function createScrollScrollbarAction(state: ScrollAreaState) {
	// always create the base action first, so we can
	// override any state mutations that occur there
	const baseAction = createBaseScrollbarAction(state);
	const { rootState, scrollbarState } = state;

	const { state: status, dispatch } = createStateMachine('hidden', {
		hidden: {
			SCROLL: 'scrolling',
		},
		scrolling: {
			SCROLL_END: 'idle',
			POINTER_ENTER: 'interacting',
		},
		interacting: {
			SCROLL: 'interacting',
			POINTER_LEAVE: 'scrolling',
		},
		idle: {
			HIDE: 'hidden',
			SCROLL: 'scrolling',
			POINTER_ENTER: 'interacting',
		},
	});

	effect([status], ([$status]) => {
		if ($status === 'idle') {
			window.setTimeout(() => {
				dispatch('HIDE');
			}, get(rootState.options.hideDelay));
		}
		if ($status === 'hidden') {
			scrollbarState.isVisible.set(false);
		} else {
			scrollbarState.isVisible.set(true);
		}
	});

	const debounceScrollEnd = debounceCallback(() => dispatch('SCROLL_END'), 100);

	effect([rootState.viewportEl, scrollbarState.isHorizontal], ([$viewportEl, $isHorizontal]) => {
		const scrollDirection = $isHorizontal ? 'scrollLeft' : 'scrollTop';

		let unsub = noop;

		if ($viewportEl) {
			let prevScrollPos = $viewportEl[scrollDirection];
			const handleScroll = () => {
				const scrollPos = $viewportEl[scrollDirection];
				const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
				if (hasScrollInDirectionChanged) {
					dispatch('SCROLL');
					debounceScrollEnd();
				}
				prevScrollPos = scrollPos;
			};

			unsub = addEventListener($viewportEl, 'scroll', handleScroll);
		}

		return () => {
			unsub();
		};
	});

	return baseAction;
}

/**
 * Creates the horizontal/x-axis scrollbar builder element.
 */
export function createScrollbarX(state: ScrollAreaState, createAction: CreateScrollbarAction) {
	const action = createAction(state);
	const { rootState, scrollbarState } = state;

	return builder(name('scrollbar'), {
		stores: [scrollbarState.sizes, rootState.options.dir, scrollbarState.isVisible],
		returned: ([$sizes, $dir, $isVisible]) => {
			return {
				style: styleToString({
					position: 'absolute',
					bottom: 0,
					left: $dir === 'rtl' ? 'var(--melt-scroll-area-corner-width)' : 0,
					right: $dir === 'ltr' ? 'var(--melt-scroll-area-corner-width' : 0,
					'--melt-scroll-area-thumb-width': $sizes ? `${getThumbSize($sizes)}px` : undefined,
					display: $isVisible ? 'block' : 'none',
				}),
				'data-state': $isVisible ? 'visible' : 'hidden',
			};
		},
		action: (node: HTMLElement) => {
			const unsubAction = action(node)?.destroy;
			rootState.scrollbarXEl.set(node);
			rootState.scrollbarXEnabled.set(true);
			return {
				destroy() {
					unsubAction?.();
					rootState.scrollbarXEl.set(null);
				},
			};
		},
	});
}

/**
 * Creates the vertical/y-axis scrollbar builder element.
 */
export function createScrollbarY(state: ScrollAreaState, createAction: CreateScrollbarAction) {
	const action = createAction(state);
	const { rootState, scrollbarState } = state;

	return builder(name('scrollbar'), {
		stores: [scrollbarState.sizes, rootState.options.dir, scrollbarState.isVisible],
		returned: ([$sizes, $dir, $isVisible]) => {
			return {
				style: styleToString({
					position: 'absolute',
					top: 0,
					right: $dir === 'ltr' ? 0 : undefined,
					left: $dir === 'rtl' ? 0 : undefined,
					bottom: 'var(--melt-scroll-area-corner-height)',
					'--melt-scroll-area-thumb-height': $sizes ? `${getThumbSize($sizes)}px` : undefined,
					display: $isVisible ? 'block' : 'none',
				}),
				'data-state': $isVisible ? 'visible' : 'hidden',
			};
		},
		action: (node: HTMLElement) => {
			const unsubAction = action(node)?.destroy;
			rootState.scrollbarYEl.set(node);
			rootState.scrollbarYEnabled.set(true);
			return {
				destroy() {
					unsubAction?.();
					rootState.scrollbarYEl.set(null);
				},
			};
		},
	});
}

export function getScrollbarActionByType(type: ScrollAreaType) {
	switch (type) {
		case 'always':
			return createBaseScrollbarAction;
		case 'auto':
			return createAutoScrollbarAction;
		case 'hover':
			return createHoverScrollbarAction;
		case 'scroll':
			return createScrollScrollbarAction;
		default:
			return createBaseScrollbarAction;
	}
}
