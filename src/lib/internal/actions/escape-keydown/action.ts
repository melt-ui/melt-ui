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
			if (e.key !== kbd.ESCAPE || !isHighestLayerEscapeKey(node)) return;
			const target = e.target;
			if (!isHTMLElement(target)) return;

			const $behaviorType = behaviorType.get();
			e.preventDefault();
			if ($behaviorType !== 'close' || shouldIgnoreEvent(e, options.ignore)) return;
			options.handler?.(e);
		};

		unsub = executeCallbacks(
			addEventListener(document, 'keydown', onKeyDown, { passive: false }),
			effect(behaviorType, ($behaviorType) => {
				if ($behaviorType === 'close') node.dataset.escapee = '';
				else delete node.dataset.escapee;
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

const isHighestLayerEscapeKey = (node: HTMLElement): boolean => {
	const topMostLayer = [...layers].findLast(([_, behaviorType]) => behaviorType.get() !== 'defer');
	return !!topMostLayer && topMostLayer[0] === node;
};

const shouldIgnoreEvent = (e: KeyboardEvent, ignore: EscapeKeydownConfig['ignore']): boolean => {
	if (!ignore) return false;
	if (isFunction(ignore) && ignore(e)) return true;
	if (Array.isArray(ignore) && ignore.some((ignoreEl) => e.target === ignoreEl)) {
		return true;
	}
	return false;
};
