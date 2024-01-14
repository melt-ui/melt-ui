import { isHTMLElement } from '$lib/internal/helpers/is.js';
import { name, type ScrollAreaState } from './create.js';
import type { Action } from 'svelte/action';
import { get } from 'svelte/store';
import { debounceCallback, getThumbSize, resizeObserver, toInt } from './helpers.js';
import { executeCallbacks, noop } from '$lib/internal/helpers/callbacks.js';
import { addEventListener, addMeltEventListener } from '$lib/internal/helpers/event.js';
import { builder, effect, styleToString } from '$lib/internal/helpers/index.js';
import type { ScrollAreaType } from './types.js';

export type CreateScrollbarAction = (state: ScrollAreaState) => Action<HTMLElement>;

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

export function createAutoScrollbarAction(state: ScrollAreaState) {
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

export function createHoverScrollbarAction(state: ScrollAreaState) {
	const baseAction = createBaseScrollbarAction(state);
	const { rootState, scrollbarState } = state;

	// with the hover scrollbar, we want it to be hidden by default
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

export function getScrollbarActionByType(type: ScrollAreaType) {
	switch (type) {
		case 'always':
			return createBaseScrollbarAction;
		case 'auto':
			return createAutoScrollbarAction;
		case 'hover':
			return createHoverScrollbarAction;
		default:
			return createBaseScrollbarAction;
	}
}
