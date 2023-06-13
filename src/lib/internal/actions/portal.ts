import { tick } from 'svelte';

export type PortalConfig = {
	/**
	 * DOM element or CSS selector to be appended to.
	 */
	target?: string | HTMLElement;
};

export function usePortal(el: HTMLElement, target: HTMLElement | string = 'body') {
	let targetEl;
	const parent = el.parentNode;

	async function update(newTarget: HTMLElement | string) {
		target = newTarget;
		if (typeof target === 'string') {
			targetEl = document.querySelector(target);
			if (targetEl === null) {
				await tick();
				targetEl = document.querySelector(target);
			}
			if (targetEl === null) {
				throw new Error(`No element found matching css selector: "${target}"`);
			}
		} else if (target instanceof HTMLElement) {
			targetEl = target;
		} else {
			throw new TypeError(
				`Unknown portal target type: ${
					target === null ? 'null' : typeof target
				}. Allowed types: string (CSS selector) or HTMLElement.`
			);
		}
		targetEl.appendChild(el);
		el.hidden = false;
	}

	function destroy() {
		if (parent) {
			parent?.appendChild(el);
		} else {
			el.remove();
		}
	}

	update(target);
	return {
		update,
		destroy,
	};
}
