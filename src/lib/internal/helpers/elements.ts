import { isHTMLElement } from './is';

/**
 * Get an element's ancestor which has a `data-portal` attribute.
 * This is used to handle nested portals/overlays/dialogs/popovers.
 */
export function getPortalParent(node: HTMLElement) {
	const portalParent = node.closest('[data-portal]');
	node.dataset.portal = '';
	if (!isHTMLElement(portalParent)) return 'body';
	return portalParent;
}
