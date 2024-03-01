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

/**
 * Gets the destination for a portal given the node and a user-specified portal prop.
 * If a portal prop is not `undefined`, it is used as the destination.
 */
export function getPortalDestination(
	node: HTMLElement,
	portalProp: string | HTMLElement | undefined | null
) {
	// user-specified portal prop, use it
	if (portalProp !== undefined) return portalProp;

	// find the closest portal parent, or the body if none is found
	const portalParent = getPortalParent(node);

	// if the portalParent is the body, we portal to the body
	// making it a "top-level" portal
	if (portalParent === 'body') return document.body;

	// if the portalParent is not the body, we have a portal parent
	// and shouldn't portal to anything so it remains within that parent
	// so we return `null`
	return null;
}
