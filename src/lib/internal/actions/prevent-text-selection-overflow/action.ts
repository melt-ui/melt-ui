import { executeCallbacks, noop } from '$lib/internal/helpers/callbacks.js';
import { addEventListener } from '$lib/internal/helpers/event.js';
import { isHTMLElement, isReadable } from '$lib/internal/helpers/is.js';
import type { Action } from 'svelte/action';
import type { PreventTextSelectionOverflowConfig } from './types.js';
import { readable } from 'svelte/store';
import { withGet } from '$lib/internal/helpers/withGet.js';
import { getOwnerDocument, isOrContainsTarget } from '$lib/internal/helpers/elements.js';

const layers = new Set();

export const usePreventTextSelectionOverflow = ((node, config = {}) => {
	layers.add(node);
	let unsubEvents = noop;
	let unsubSelectionLock = noop;
	const documentObj = getOwnerDocument(node);
	let isPointerDownInside = false;

	const update = (config: PreventTextSelectionOverflowConfig) => {
		unsubEvents();
		resetSelectionLock();

		const options = { enabled: true, ...config } satisfies PreventTextSelectionOverflowConfig;
		const enabled = isReadable(options.enabled)
			? options.enabled
			: withGet(readable(options.enabled));

		const onPointerDown = (e: PointerEvent) => {
			const target = e.target;
			if (!isHighestLayer(node) || !isHTMLElement(target) || !enabled.get()) return;
			isPointerDownInside = isOrContainsTarget(node, target);
			if (isPointerDownInside) {
				unsubSelectionLock = preventTextSelectionOverflow(node);
			}
		};

		unsubEvents = executeCallbacks(
			addEventListener(documentObj, 'pointerdown', onPointerDown, true),
			addEventListener(documentObj, 'pointerup', resetSelectionLock, true)
		);
	};

	const resetSelectionLock = () => {
		unsubSelectionLock();
		unsubSelectionLock = noop;
		isPointerDownInside = false;
	};

	update(config);

	return {
		destroy() {
			layers.delete(node);
			unsubEvents();
			resetSelectionLock();
		},
		update,
	};
}) satisfies Action<HTMLElement, PreventTextSelectionOverflowConfig>;

const preventTextSelectionOverflow = (node: HTMLElement) => {
	const body = document.body;
	const originalBodyUserSelect = getUserSelect(body);
	const originalNodeUserSelect = getUserSelect(node);
	setUserSelect(body, 'none');
	setUserSelect(node, 'text');
	return () => {
		setUserSelect(body, originalBodyUserSelect);
		setUserSelect(node, originalNodeUserSelect);
	};
};

const getUserSelect = (node: HTMLElement) => node.style.userSelect || node.style.webkitUserSelect;

const setUserSelect = (node: HTMLElement, value: string) => {
	node.style.userSelect = value;
	node.style.webkitUserSelect = value;
};

const isHighestLayer = (node: HTMLElement) => [...layers].at(-1) === node;
