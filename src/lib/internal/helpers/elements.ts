import { isHTMLElement } from './is.js';

/**
 * Get an element's ancestor which has a `data-portal` attribute.
 * This is used to handle nested portals/overlays/dialogs/popovers.
 */
function getPortalParent(node: HTMLElement) {
	let parent = node.parentElement;
	while (isHTMLElement(parent) && !parent.hasAttribute('data-portal')) {
		parent = parent.parentElement;
	}
	return parent || 'body';
}

export function getPortalDestination(
	node: HTMLElement,
	portalProp: string | HTMLElement | undefined | null
) {
	if (portalProp !== undefined) return portalProp;
	const portalParent = getPortalParent(node);
	if (portalParent === 'body') return document.body;
	return null;
}
