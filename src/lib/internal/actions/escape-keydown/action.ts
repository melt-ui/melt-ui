import { addEventListener } from '$lib/internal/helpers/event.js';
import { isFunction, isHTMLElement, isReadable } from '$lib/internal/helpers/is.js';
import { get, readable, type Readable } from 'svelte/store';
import { effect, executeCallbacks, kbd, noop } from '../../helpers/index.js';
import type { EscapeKeydownConfig } from './types.js';

const layers = new Set<HTMLElement>();

export const useEscapeKeydown = (node: HTMLElement, config: EscapeKeydownConfig = {}) => {
	let unsub = noop;
	layers.add(node);

	function update(config: EscapeKeydownConfig = {}) {
		unsub();

		const options = { enabled: true, ...config };
		const enabled = (
			isReadable(options.enabled) ? options.enabled : readable(options.enabled)
		) as Readable<boolean>;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== kbd.ESCAPE || !isHighestLayerEscapeKey(node)) return;
			const target = e.target;
			if (!isHTMLElement(target)) return;

			e.preventDefault();
			if (!get(enabled)) return;

			// If an ignore function is passed, check if it returns true
			if (options.ignore) {
				if (isFunction(options.ignore)) {
					if (options.ignore(e)) return;
				}
				// If an ignore array is passed, check if any elements in the array match the target
				else if (Array.isArray(options.ignore)) {
					if (
						options.ignore.length > 0 &&
						options.ignore.some((ignoreEl) => {
							return ignoreEl && target === ignoreEl;
						})
					)
						return;
				}
			}

			// If none of the above conditions are met, call the handler
			options.handler?.(e);
		};

		unsub = executeCallbacks(
			// Handle escape keydowns
			addEventListener(document, 'keydown', onKeyDown, { passive: false }),
			effect(enabled, ($enabled) => {
				if ($enabled) {
					node.dataset.escapee = '';
				} else {
					delete node.dataset.escapee;
				}
			})
		);
	}

	update(config);

	return {
		update,
		destroy() {
			layers.delete(node);
			node.removeAttribute('data-escapee');
			unsub();
		},
	};
};

export const isHighestLayerEscapeKey = (node: HTMLElement): boolean => {
	const index = Array.from(layers).indexOf(node);
	return index === layers.size - 1;
};
