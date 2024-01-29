import {
	addEventListener,
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateIds,
	isHTMLElement,
	noop,
	styleToString,
	toWritableStores,
	type IdObj,
	type ToWritableStores,
	omit,
	withGet,
} from '$lib/internal/helpers/index.js';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import type { CreateScrollAreaProps } from './types.js';
import type { Orientation, TextDirection } from '$lib/internal/types.js';
import {
	addUnlinkedScrollListener,
	getScrollPositionFromPointer,
	getThumbOffsetFromScroll,
	getThumbRatio,
	isScrollingWithinScrollbarBounds,
	type Sizes,
} from './helpers.js';
import { createScrollbarX, createScrollbarY, getScrollbarActionByType } from './scrollbars.js';
import type { WithGet } from '../../internal/helpers/withGet.js';

type ScrollAreaParts = 'root' | 'viewport' | 'content' | 'scrollbar' | 'thumb' | 'corner';
export const { name } = createElHelpers<ScrollAreaParts>('scroll-area');

const scrollAreaIdParts = [
	'root',
	'viewport',
	'content',
	'scrollbarX',
	'scrollbarY',
	'thumbX',
	'thumbY',
] as const;
export type ScrollAreaIdParts = typeof scrollAreaIdParts;

export type ScrollAreaRootState = {
	cornerWidth: WithGet<Writable<number>>;
	cornerHeight: WithGet<Writable<number>>;
	scrollbarXEnabled: WithGet<Writable<boolean>>;
	scrollbarYEnabled: WithGet<Writable<boolean>>;
	scrollbarXEl: WithGet<Writable<HTMLElement | null>>;
	scrollbarYEl: WithGet<Writable<HTMLElement | null>>;
	scrollAreaEl: WithGet<Writable<HTMLElement | null>>;
	viewportEl: WithGet<Writable<HTMLElement | null>>;
	contentEl: WithGet<Writable<HTMLElement | null>>;
	options: ToWritableStores<Required<Omit<CreateScrollAreaProps, 'ids'>>>;
	ids: ToWritableStores<IdObj<ScrollAreaIdParts>>;
};

export type ScrollAreaScrollbarState = {
	isHorizontal: WithGet<Writable<boolean>>;
	domRect: WithGet<Writable<DOMRect | null>>;
	prevWebkitUserSelect: WithGet<Writable<string>>;
	pointerOffset: WithGet<Writable<number>>;
	thumbEl: WithGet<Writable<HTMLElement | null>>;
	scrollbarEl: WithGet<Writable<HTMLElement | null>>;
	sizes: WithGet<Writable<Sizes>>;
	orientation: WithGet<Writable<Orientation>>;
	hasThumb: WithGet<Readable<boolean>>;
	isVisible: WithGet<Writable<boolean>>;
	handleWheelScroll: (e: WheelEvent, payload: number) => void;
	handleThumbDown: (payload: { x: number; y: number }) => void;
	handleThumbUp: (e: MouseEvent) => void;
	onThumbPositionChange: () => void;
	onDragScroll: (payload: number) => void;
};

export type ScrollAreaState = {
	rootState: ScrollAreaRootState;
	scrollbarState: ScrollAreaScrollbarState;
};

const defaults = {
	type: 'hover' as const,
	hideDelay: 600,
	dir: 'ltr' as const,
};

export function createScrollArea(props?: CreateScrollAreaProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores(omit(withDefaults, 'ids'));

	const cornerWidth = withGet.writable(0);
	const cornerHeight = withGet.writable(0);
	const scrollbarXEnabled = withGet.writable(false);
	const scrollbarYEnabled = withGet.writable(false);

	const scrollAreaEl = withGet.writable<HTMLElement | null>(null);
	const viewportEl = withGet.writable<HTMLElement | null>(null);
	const contentEl = withGet.writable<HTMLElement | null>(null);
	const scrollbarXEl = withGet.writable<HTMLElement | null>(null);
	const scrollbarYEl = withGet.writable<HTMLElement | null>(null);

	const ids = toWritableStores({ ...generateIds(scrollAreaIdParts), ...withDefaults.ids });

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
		ids,
	};

	const root = builder(name(), {
		stores: [cornerWidth, cornerHeight, ids.root],
		returned: ([$cornerWidth, $cornderHeight, $rootId]) => {
			return {
				style: styleToString({
					position: 'relative',
					'--melt-scroll-area-corner-width': `${$cornerWidth}px`,
					'--melt-scroll-area-corner-height': `${$cornderHeight}px`,
				}),
				id: $rootId,
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
		stores: [scrollbarXEnabled, scrollbarYEnabled, ids.viewport],
		returned: ([$scrollbarXEnabled, $scrollbarYEnabled, $viewportId]) => {
			return {
				style: styleToString({
					'scrollbar-width': 'none',
					'-ms-overflow-style': 'none',
					'-webkit-overflow-scrolling': 'touch',
					'-webkit-scrollbar': 'none',
					'overflow-x': $scrollbarXEnabled ? 'scroll' : 'hidden',
					'overflow-y': $scrollbarYEnabled ? 'scroll' : 'hidden',
				}),
				id: $viewportId,
			};
		},
		action: (node: HTMLElement) => {
			// Ensure we hide any native scrollbars on the viewport element
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
		stores: [ids.content],
		returned: ([$contentId]) => {
			return {
				style: styleToString({
					'min-width': '100%',
					display: 'table',
				}),
				id: $contentId,
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
		const orientation = withGet.writable(orientationProp);
		const isHorizontal = withGet.writable(orientationProp === 'horizontal');
		const domRect = withGet.writable<DOMRect | null>(null);
		const prevWebkitUserSelect = withGet.writable('');
		const pointerOffset = withGet.writable(0);
		const thumbEl = withGet.writable<HTMLElement | null>(null);
		const scrollbarEl = withGet.writable<HTMLElement | null>(null);

		const sizes = withGet.writable<Sizes>({
			content: 0,
			viewport: 0,
			scrollbar: {
				size: 0,
				paddingStart: 0,
				paddingEnd: 0,
			},
		});

		const isVisible = withGet.writable(false);

		const hasThumb = withGet.derived(sizes, ($sizes) => {
			const thumbRatio = getThumbRatio($sizes.viewport, $sizes.content);
			return Boolean(thumbRatio > 0 && thumbRatio < 1);
		});

		function getScrollPosition(pointerPos: number, dir?: TextDirection) {
			return getScrollPositionFromPointer(pointerPos, pointerOffset.get(), sizes.get(), dir);
		}

		function handleWheelScroll(e: WheelEvent, payload: number) {
			const $viewportEl = viewportEl.get();
			if (!$viewportEl) return;
			if (isHorizontal.get()) {
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
			if (isHorizontal.get()) {
				pointerOffset.set(payload.x);
			} else {
				pointerOffset.set(payload.y);
			}
		}

		function handleThumbUp() {
			pointerOffset.set(0);
		}

		function onThumbPositionChange() {
			const $viewportEl = viewportEl.get();
			const $thumbEl = thumbEl.get();
			if (!$viewportEl || !$thumbEl) return;
			if (isHorizontal.get()) {
				const scrollPos = $viewportEl.scrollLeft;
				const offset = getThumbOffsetFromScroll(
					scrollPos,
					sizes.get(),
					rootState.options.dir.get()
				);
				$thumbEl.style.transform = `translate3d(${offset}px, 0, 0)`;
			} else {
				const scrollPos = $viewportEl.scrollTop;
				const offset = getThumbOffsetFromScroll(
					scrollPos,
					sizes.get(),
					rootState.options.dir.get()
				);
				$thumbEl.style.transform = `translate3d(0, ${offset}px, 0)`;
			}
		}

		function onDragScroll(payload: number) {
			const $viewportEl = viewportEl.get();
			if (!$viewportEl) return;
			if (isHorizontal.get()) {
				$viewportEl.scrollLeft = getScrollPosition(payload, rootState.options.dir.get());
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
			isVisible,
		};

		const scrollbarActionByType = getScrollbarActionByType(options.type.get());
		const scrollAreaState = { rootState, scrollbarState };

		const scrollbar =
			orientationProp === 'horizontal'
				? createScrollbarX(scrollAreaState, scrollbarActionByType)
				: createScrollbarY(scrollAreaState, scrollbarActionByType);

		const thumb = createScrollbarThumb(scrollAreaState);

		return {
			scrollbar,
			thumb,
		};
	}

	const { scrollbar: scrollbarX, thumb: thumbX } = createScrollbar('horizontal');
	const { scrollbar: scrollbarY, thumb: thumbY } = createScrollbar('vertical');

	const corner = createScrollAreaCorner(rootState);

	return {
		options,
		elements: {
			root,
			viewport,
			content,
			corner,
			scrollbarX,
			scrollbarY,
			thumbX,
			thumbY,
		},
	};
}

function createScrollbarThumb(state: ScrollAreaState) {
	const { scrollbarState, rootState } = state;
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

	let unsubListener: (() => void) | undefined = undefined;

	function handleScroll() {
		if (unsubListener) return;
		const $viewportEl = rootState.viewportEl.get();
		if ($viewportEl) {
			unsubListener = addUnlinkedScrollListener($viewportEl, scrollbarState.onThumbPositionChange);
		}
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

			let effectHasRan = 0;
			let unsubViewportScroll = noop;

			effect([scrollbarState.sizes], ([_]) => {
				if (effectHasRan === 2) return;
				const $viewportEl = rootState.viewportEl.get();
				if ($viewportEl) {
					scrollbarState.onThumbPositionChange();
					unsubViewportScroll = addEventListener($viewportEl, 'scroll', handleScroll);
					effectHasRan++;
				}
			});

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', handlePointerDown),
				addMeltEventListener(node, 'pointerup', handlePointerUp)
			);

			return {
				destroy() {
					unsubListener?.();
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
		const offsetHeight = rootState.scrollbarXEl.get()?.offsetHeight || 0;
		rootState.cornerHeight.set(offsetHeight);
		height.set(offsetHeight);
	}

	function setCornerWidth() {
		const offsetWidth = rootState.scrollbarYEl.get()?.offsetWidth || 0;
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