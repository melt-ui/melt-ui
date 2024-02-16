import { tick } from 'svelte';
import type { ActionReturn } from 'svelte/action';
import { isHTMLElement } from '../helpers/is.js';

export type PortalTarget = string | HTMLElement | undefined;

export function usePortal(el: HTMLElement, target?: PortalTarget) {
	async function run() {
		const targetEl = await getTargetEl(target);
		targetEl.appendChild(el);
		el.dataset.portal = '';
		el.hidden = false;
	}

	run();

	return {
		update(newTarget) {
			target = newTarget;
			run();
		},
		destroy() {
			el.remove();
		},
	} satisfies ActionReturn<PortalTarget>;
}

async function getTargetEl(target: PortalTarget) {
	if (target === undefined) {
		return document.body;
	}

	if (isHTMLElement(target)) {
		return target;
	}

	let targetEl = document.querySelector(target);
	if (targetEl !== null) {
		return targetEl;
	}

	await tick();

	targetEl = document.querySelector(target);
	if (targetEl !== null) {
		return targetEl;
	}

	throw new Error(`No element found matching CSS selector: "${target}"`);
}
