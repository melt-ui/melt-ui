import { isHTMLElement } from './is.js';

/**
 * Get an element's ancestor which has a `data-portal` attribute.
 * This is used to handle nested portals/overlays/dialogs/popovers.
 */
function getPortalParent(node: HTMLElement) {
	let parent = node.parentElement;
	while (isHTMLElement(parent) && parent.getAttribute('data-portal') === null) {
		parent = parent.parentElement;
	}
	return parent || 'body';
}

export function getPortalDestination(
	node: HTMLElement,
	portalProp: string | HTMLElement | undefined | null
) {
	const portalParent = getPortalParent(node);
	if (portalProp !== undefined) return portalProp;
	if (portalParent === 'body') return document.body;
	return null;
}

/**
 * Calculates the inverse scale of a given node based on its offset width and the given rectangle.
 *
 * @param {HTMLElement} node - The node for which to calculate the inverse scale.
 * @param {DOMRect} rect - The rectangle used for calculating the inverse scale.
 * @returns {number} The inverse scale of the node.
 */
export function calculateInverseScale(node: HTMLElement, rect: DOMRect) {
	// Calculate the current scale of the node
	let inverseScale = node.offsetWidth / rect.width;
	if (isNaN(inverseScale)) inverseScale = 1;
	return inverseScale;
}

/**
 * Removes attributes from an HTML element that start with a specified string.
 *
 * @param {Element} node - The HTML element from which to remove the attributes.
 * @param {string} startString - The string to check for at the beginning of the attribute names.
 */
export function removeAttributesStartingWith(node: Element, startString: string): void {
	const attributeNames = Array.from(node.attributes, (attr) => attr.name);
	for (const attributeName of attributeNames) {
		if (attributeName.startsWith(startString)) {
			node.removeAttribute(attributeName);
		}
	}
}
