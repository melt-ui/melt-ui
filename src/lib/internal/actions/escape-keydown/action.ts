import { addEventListener } from '$lib/internal/helpers/event.js';
import { isFunction, isHTMLElement, isReadable } from '$lib/internal/helpers/is.js';
import { readable, type Readable } from 'svelte/store';
import { effect, executeCallbacks, kbd, noop, withGet, type WithGet } from '../../helpers/index.js';
import type { EscapeBehaviorType, EscapeKeydownConfig } from './types.js';
import type { Action } from 'svelte/action';

const layers = new Map<HTMLElement, WithGet<Readable<EscapeBehaviorType>>>();

export const useEscapeKeydown = ((node, config = {}) => {
	let unsub = noop;

	function update(config: EscapeKeydownConfig = {}) {
		unsub();
		const options = { behaviorType: 'close', ...config } satisfies EscapeKeydownConfig;
		const behaviorType = isReadable(options.behaviorType)
			? options.behaviorType
			: withGet(readable(options.behaviorType));

		layers.set(node, behaviorType);

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== kbd.ESCAPE || !isResponsibleEscapeLayer(node)) return;
			const target = e.target;
			if (!isHTMLElement(target)) return;

			e.preventDefault();
			if (shouldIgnoreEvent(e, options.ignore)) return;
			if (shouldInvokeResponsibleLayerHandler(behaviorType.get())) {
				options.handler?.(e);
			}
		};

		unsub = executeCallbacks(
			addEventListener(document, 'keydown', onKeyDown, { passive: false }),
			effect(behaviorType, ($behaviorType) => {
				if (
					$behaviorType === 'close' ||
					($behaviorType === 'defer-otherwise-close' && [...layers.keys()][0] === node)
				) {
					node.dataset.escapee = '';
				} else {
					delete node.dataset.escapee;
				}
			}),
			behaviorType.destroy || noop
		);
	}

	update(config);

	return {
		update,
		destroy() {
			layers.delete(node);
			delete node.dataset.escapee;
			unsub();
		},
	};
}) satisfies Action<HTMLElement, EscapeKeydownConfig>;

const isResponsibleEscapeLayer = (node: HTMLElement): boolean => {
	const layersArr = [...layers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and matches the provided node, then the node is
	 * responsible for the escape. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = layersArr.findLast(([_, behaviorType]) => {
		const $behaviorType = behaviorType.get();
		return $behaviorType === 'close' || $behaviorType === 'ignore';
	});
	if (topMostLayer) return topMostLayer[0] === node;
	const [firstLayerNode] = layersArr[0];
	return firstLayerNode === node;
};

const shouldIgnoreEvent = (e: KeyboardEvent, ignore: EscapeKeydownConfig['ignore']): boolean => {
	if (!ignore) return false;
	if (isFunction(ignore) && ignore(e)) return true;
	if (Array.isArray(ignore) && ignore.some((ignoreEl) => e.target === ignoreEl)) {
		return true;
	}
	return false;
};

const shouldInvokeResponsibleLayerHandler = (behaviorType: EscapeBehaviorType) => {
	return behaviorType === 'close' || behaviorType === 'defer-otherwise-close';
};
