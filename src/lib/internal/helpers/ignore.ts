import { getElementByMeltId, isElement, isHTMLLabelElement } from '$lib/internal/helpers/index.js';

export function createClickOutsideIgnore(meltId: string) {
	return (e: PointerEvent) => {
		const target = e.target;
		const triggerEl = getElementByMeltId(meltId);
		if (!triggerEl || !isElement(target)) return false;

		const id = triggerEl.id;

		if (isHTMLLabelElement(target) && id === target.htmlFor) {
			return true;
		}

		if (target.closest(`label[for="${id}"]`)) {
			return true;
		}

		return false;
	};
}
