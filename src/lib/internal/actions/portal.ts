import { tick } from 'svelte';

export type PortalConfig = {
	/**
	 * DOM element or CSS selector to be appended to.
	 */
	target?: string | HTMLElement;
};

export const usePortal = (node: HTMLElement, config: PortalConfig = {}) => {
	async function move() {
		const { target } = config;

		let targetEl: HTMLElement | null;

		if (!target) {
			targetEl = document.body;
		} else if (typeof target === 'string') {
			targetEl = document.querySelector(target);
			if (targetEl === null) {
				await tick();
				targetEl = document.querySelector(target);
			}
			if (targetEl === null) {
				throw new Error(`No element found matching selector: "${target}"`);
			}
		} else if (target instanceof HTMLElement) {
			targetEl = target;
		} else {
			throw new TypeError(
				`Unknown portal target type: ${target === null ? 'null' : typeof target}`
			);
		}
		targetEl.appendChild(node);
	}

	move();

	return () => {
		node.remove();
	};
};
