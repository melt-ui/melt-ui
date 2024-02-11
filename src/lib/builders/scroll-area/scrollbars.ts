import {
	addEventListener,
	addMeltEventListener,
	effect,
	executeCallbacks,
	isHTMLElement,
	isTouchDevice,
	makeElement,
	noop,
	sleep,
	styleToString,
} from '$lib/internal/helpers/index.js';
import { createStateMachine } from '$lib/internal/helpers/store/stateMachine.js';
import type { Action } from 'svelte/action';
import { name, type ScrollAreaState } from './create.js';
import { debounceCallback, getThumbSize, resizeObserver } from './helpers.js';
import type { ScrollAreaType } from './types.js';

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
		const $domRect = scrollbarState.domRect.get();
		if ($domRect) {
			const x = e.clientX - $domRect.left;
			const y = e.clientY - $domRect.top;
			const $isHorizontal = scrollbarState.isHorizontal.get();
			if ($isHorizontal) {
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
		const $viewportEl = rootState.viewportEl.get();
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
		document.body.style.webkitUserSelect = scrollbarState.prevWebkitUserSelect.get();
		const $viewportEl = rootState.viewportEl.get();
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

		const $sizes = scrollbarState.sizes.get();
		if (!$sizes) return;
		const maxScrollPos = $sizes.content - $sizes.viewport;
		scrollbarState.handleWheelScroll(e, maxScrollPos);
	}

	// We need to recompute the sizes when the visibility of
	// the scrollbar changes
	effect([scrollbarState.isVisible], ([_]) => {
		sleep(1).then(() => scrollbarState.handleSizeChange());
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

			return resizeObserver($contentEl, scrollbarState.handleSizeChange);
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
		const $viewportEl = rootState.viewportEl.get();
		if ($viewportEl) {
			const isOverflowX = $viewportEl.offsetWidth < $viewportEl.scrollWidth;
			const isOverflowY = $viewportEl.offsetHeight < $viewportEl.scrollHeight;

			scrollbarState.isVisible.set(scrollbarState.isHorizontal.get() ? isOverflowX : isOverflowY);
		}
	}, 10);

	function scrollbarAutoAction(node: HTMLElement) {
		const unsubBaseAction = baseAction(node)?.destroy;
		handleResize();
		const unsubObservers: Array<() => void> = [];

		const $viewportEl = rootState.viewportEl.get();
		if ($viewportEl) {
			unsubObservers.push(resizeObserver($viewportEl, handleResize));
		}
		const $contentEl = rootState.contentEl.get();
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
		if (scrollbarState.isVisible.get()) return;
		scrollbarState.isVisible.set(true);
	}

	function handlePointerLeave() {
		timeout = window.setTimeout(() => {
			if (!scrollbarState.isVisible.get()) return;
			scrollbarState.isVisible.set(false);
		}, rootState.options.hideDelay.get());
	}

	function scrollbarHoverAction(node: HTMLElement) {
		const unsubBaseAction = baseAction(node)?.destroy;
		const scrollAreaEl = node.closest('[data-melt-scroll-area]');
		let unsubScrollAreaListeners = noop;
		if (scrollAreaEl) {
			if (isTouchDevice()) {
				unsubScrollAreaListeners = executeCallbacks(
					addEventListener(scrollAreaEl, 'touchstart', handlePointerEnter),
					addEventListener(scrollAreaEl, 'touchend', handlePointerLeave)
				);
			} else {
				unsubScrollAreaListeners = executeCallbacks(
					addEventListener(scrollAreaEl, 'pointerenter', handlePointerEnter),
					addEventListener(scrollAreaEl, 'pointerleave', handlePointerLeave)
				);
			}
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

	const machine = createStateMachine('hidden', {
		hidden: {
			SCROLL: 'scrolling',
		},
		scrolling: {
			POINTER_ENTER: 'interacting',
			SCROLL_END: 'idle',
		},
		interacting: {
			POINTER_LEAVE: 'scrolling',
			SCROLL: 'interacting',
		},
		idle: {
			HIDE: 'hidden',
			POINTER_ENTER: 'interacting',
			SCROLL: 'scrolling',
		},
	});

	effect([machine.state], ([$status]) => {
		if ($status === 'idle') {
			window.setTimeout(() => {
				machine.dispatch('HIDE');
			}, rootState.options.hideDelay.get());
		}
		if ($status === 'hidden') {
			scrollbarState.isVisible.set(false);
		} else {
			scrollbarState.isVisible.set(true);
		}
	});

	const debounceScrollEnd = debounceCallback(() => machine.dispatch('SCROLL_END'), 100);

	effect([rootState.viewportEl, scrollbarState.isHorizontal], ([$viewportEl, $isHorizontal]) => {
		const scrollDirection = $isHorizontal ? 'scrollLeft' : 'scrollTop';

		let unsub = noop;

		if ($viewportEl) {
			let prevScrollPos = $viewportEl[scrollDirection];
			const handleScroll = () => {
				const scrollPos = $viewportEl[scrollDirection];
				const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
				if (hasScrollInDirectionChanged) {
					machine.dispatch('SCROLL');
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

	return makeElement(name('scrollbar'), {
		stores: [scrollbarState.sizes, rootState.options.dir, scrollbarState.isVisible],
		returned: ([$sizes, $dir, $isVisible]) => {
			return {
				style: styleToString({
					position: 'absolute',
					bottom: 0,
					left: $dir === 'rtl' ? 'var(--melt-scroll-area-corner-width)' : 0,
					right: $dir === 'ltr' ? 'var(--melt-scroll-area-corner-width' : 0,
					'--melt-scroll-area-thumb-width': $sizes ? `${getThumbSize($sizes)}px` : undefined,
					display: !$isVisible ? 'none' : undefined,
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

	return makeElement(name('scrollbar'), {
		stores: [scrollbarState.sizes, rootState.options.dir, scrollbarState.isVisible],
		returned: ([$sizes, $dir, $isVisible]) => {
			return {
				style: styleToString({
					position: 'absolute',
					top: 0,
					right: $dir === 'ltr' ? 0 : undefined,
					left: $dir === 'rtl' ? 0 : undefined,
					bottom: 'var(--melt-scroll-area-corner-height)',
					'--melt-scroll-area-thumb-height': `${getThumbSize($sizes)}px`,
					visibility: !$isVisible ? 'hidden' : undefined,
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
