import { calculateInverseScale, clamp, removeAttributesStartingWith } from '$lib/internal/helpers';
import type {
	SortableBounds,
	SortableGhost,
	SortableOrientation,
	SortableQuadrant,
	SortableZoneProps,
} from './types';

/**
 * Determines if a zone support the dropping of an item.
 *
 * @param {string} originZone - The origin zone. This is likely the origin zone of the selected
 * item.
 * @param {string} zone - The zone to check against. This is likely the zone the pointer is in.
 * @param {'*' | '-' | string[]} zones - The allowed zones.
 * @returns {boolean} - True if the zone is supported, false otherwise.
 */
export function supportedZone(
	originZone: string,
	zone: string,
	zones: '*' | '-' | string[]
): boolean {
	// If the origin zone matches the zone, return true.
	if (originZone === zone) return true;

	// If zones is a string, return true if '*', else false.
	if (typeof zones === 'string') return zones === '*' ? true : false;

	// Zones must be an array. Check if the originZone is included.
	return zones.includes(originZone);
}

/**
 * Creates a ghost element based on the source element and pointer event.
 *
 * @param {HTMLElement} sourceEl - The source element to create the ghost from.
 * @param {PointerEvent} e - The pointer event containing the clientX and clientY coordinates.
 * @param {ZoneAxis} zoneAxis - Sets the axis the ghost is constrained to.
 * @returns {SortableGhost} - The SortableGhost object.
 */
export function createGhostEl(
	sourceEl: HTMLElement,
	e: PointerEvent,
	zoneProps: Required<SortableZoneProps>
): SortableGhost {
	const ghostEl = sourceEl.cloneNode(true) as HTMLElement;

	ghostEl.style.position = 'fixed';
	ghostEl.style.pointerEvents = 'none';
	ghostEl.style.zIndex = '99999';
	ghostEl.style.transitionDuration = '0ms';

	removeAttributesStartingWith(ghostEl, 'data-melt');
	ghostEl.setAttribute('data-melt-ghost', '');

	// Get the bounding box of the source element
	const rect = sourceEl.getBoundingClientRect();

	// Position the ghost image at the same position as the source element
	ghostEl.style.left = `${e.clientX - (e.clientX - rect.left)}px`;
	ghostEl.style.top = `${e.clientY - (e.clientY - rect.top)}px`;
	ghostEl.style.width = `${rect.width}px`;
	ghostEl.style.height = `${rect.height}px`;

	// The axis the ghost element can move in
	const canMoveInX = /(both|x)/.test(zoneProps.axis);
	const canMoveInY = /(both|y)/.test(zoneProps.axis);

	const { clientX, clientY } = e;
	const inverseScale = calculateInverseScale(sourceEl, rect);

	let initialX = 0,
		initialY = 0;
	if (canMoveInX) initialX = clientX / inverseScale;
	if (canMoveInY) initialY = clientY / inverseScale;

	// Append the ghost element to the source element's parent. This keeps the styling consistent
	sourceEl.parentElement?.appendChild(ghostEl);

	return {
		el: ghostEl,
		bounds: rect,
		restrictedBounds: computeRestrictedRect(zoneProps.restrictTo),
		canMoveInX,
		canMoveInY,
		initialX,
		initialY,
		clientToNodeOffsetX: clientX - rect.left,
		clientToNodeOffsetY: clientY - rect.top,
	};
}

/**
 * Checks if the clientY coordinate of a pointer event intersects with the specified SortableItem
 * within a given threshold.
 *
 * @param {HTMLElement} el - An HTMLElement to check the intersection against.
 * @param {SortableGhost} $ghost - The ghost.
 * @param {PointerEvent} e - The pointer event containing the clientY coordinate to check against.
 * @param {number} threshold - The threshold (as a decimal value) to apply to the SortableItem's
 * height to determine the intersection boundaries.
 * @param {SortableOrientation} orientation - The orientation of the threshold. If
 * vertical, the threshold will be applied to the elements height. If horizontal, the threshold
 * will be applied to the elements width. If both, the threshold will be applied to both.
 * @returns {boolean} - True if the clientY coordinate of the pointer event intersects with the
 * SortableItem within the specified threshold, otherwise false.
 */
export function intersect(
	el: HTMLElement,
	ghost: SortableGhost,
	e: PointerEvent,
	threshold: number,
	orientation: SortableOrientation
) {
	const itemBounds = el.getBoundingClientRect();

	let widthThreshold = itemBounds.width;
	let heightThreshold = itemBounds.height;
	let middleWidth = itemBounds.left + itemBounds.width / 2;
	let middleHeight = itemBounds.top + itemBounds.height / 2;
	let leftThreshold = itemBounds.left;
	let rightThreshold = itemBounds.right;
	let topThreshold = itemBounds.top;
	let bottomThreshold = itemBounds.bottom;

	if (orientation === 'vertical' || orientation === 'both') {
		heightThreshold = (itemBounds.height * threshold) / 2;
		middleHeight = itemBounds.top + itemBounds.height / 2;
		topThreshold = middleHeight - heightThreshold;
		bottomThreshold = middleHeight + heightThreshold;
	}

	if (orientation === 'horizontal' || orientation === 'both') {
		widthThreshold = (itemBounds.width * threshold) / 2;
		middleWidth = itemBounds.left + itemBounds.width / 2;
		leftThreshold = middleWidth - widthThreshold;
		rightThreshold = middleWidth + widthThreshold;
	}

	// Check if the mouse is intersecting the item
	const hit =
		e.clientX >= leftThreshold &&
		e.clientX <= rightThreshold &&
		e.clientY >= topThreshold &&
		e.clientY <= bottomThreshold;

	if (!hit) return { hit };

	// Ensure part of the ghost is also intersecting the item. When the ghost is restricted
	// the pointer can move but the ghost may not.
	if (ghost && ghost.bounds) {
		const ghostBounds = ghost.bounds;

		const ghostHit =
			ghostBounds.left < itemBounds.right &&
			ghostBounds.right > itemBounds.left &&
			ghostBounds.top < itemBounds.bottom &&
			ghostBounds.bottom > itemBounds.top;

		if (!ghostHit) return { hit: false };
	}

	// Determine which quadrant the pointer is in
	const isTopHalf = e.clientY < itemBounds.top + itemBounds.height / 2;
	const isLeftHalf = e.clientX < itemBounds.left + itemBounds.width / 2;

	const quadrant: SortableQuadrant = {
		vertical: isTopHalf ? 'top' : 'bottom',
		horizontal: isLeftHalf ? 'left' : 'right',
	};

	return { hit, quadrant };
}

/**
 * Computes the bounding rectangle for a given set of bounds and a root node.
 *
 * @param {SortableBounds} bounds - The bounds for which to calculate the bounding rectangle.
 * @returns {DOMRect | null} The bounding rectangle for the given bounds and root node, or null
 *  if no valid bounding rectangle is found.
 */
export function computeRestrictedRect(bounds: SortableBounds) {
	if (bounds === undefined || bounds === 'none') return null;

	// Body
	if (bounds === 'body') return document.body.getBoundingClientRect();

	// Selector
	const node = document.querySelector<HTMLElement>(<string>bounds);
	if (!node) return null;
	return node.getBoundingClientRect();
}

/**
 * Translates the position of a $ghost element based on a pointer event.
 *
 * @param {SortableGhost} $ghost - The $ghost to be translated.
 * @param {PointerEvent} e - The pointer event containing the clientX and clientY coordinates.
 */
export function translate(ghost: SortableGhost, e: PointerEvent) {
	// Get the new bounds
	ghost.bounds = ghost.el.getBoundingClientRect();

	// Get final values for clamping
	let finalX = e.clientX,
		finalY = e.clientY;

	const inverseScale = calculateInverseScale(ghost.el, ghost.bounds);

	// Client position is limited to this virtual boundary to prevent node going out of bounds
	if (ghost.restrictedBounds) {
		const virtualClientBounds = {
			left: ghost.restrictedBounds.left + ghost.clientToNodeOffsetX,
			top: ghost.restrictedBounds.top + ghost.clientToNodeOffsetY,
			right: ghost.restrictedBounds.right + ghost.clientToNodeOffsetX - ghost.bounds.width,
			bottom: ghost.restrictedBounds.bottom + ghost.clientToNodeOffsetY - ghost.bounds.height,
		};

		finalX = clamp(finalX, virtualClientBounds.left, virtualClientBounds.right);
		finalY = clamp(finalY, virtualClientBounds.top, virtualClientBounds.bottom);
	}

	let translateX = 0,
		translateY = 0;

	if (ghost.canMoveInX) translateX = Math.round((finalX - ghost.initialX) * inverseScale);
	if (ghost.canMoveInY) translateY = Math.round((finalY - ghost.initialY) * inverseScale);

	ghost.el.style.translate = `${translateX}px ${translateY}px 1px`;
}

/**
 * Moves the selected item within the given parent to before/after and element.
 *
 * @param {HTMLElement} selectedEl - The selected element to move.
 * @param {HTMLElement} itemEl - The item element within the parent element.
 * @param {boolean} after - A boolean indicating whether the selected item should be placed before
 * or after the item.
 */
export function moveSelected(selectedEl: HTMLElement, itemEl: HTMLElement, after: boolean) {
	const parent = itemEl.parentNode;
	if (!parent) return;
	parent.insertBefore(selectedEl, after ? itemEl.nextSibling : itemEl);
}
