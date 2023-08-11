import { calculateInverseScale, clamp, removeAttributesStartingWith } from '$lib/internal/helpers';
import type {
	SortableBounds,
	SortableGhost,
	SortableHit,
	SortableIntersect,
	SortableOrientation,
	SortableQuadrant,
	SortableThreshold,
	SortableZoneProps,
} from './types';

/**
 * Creates a ghost element based on the source element and pointer event.
 *
 * @param {HTMLElement} sourceEl - The source element to create the ghost from.
 * @param {PointerEvent} e - The pointer event containing the clientX and clientY coordinates.
 * @param {ZoneAxis} zoneAxis - Axis the ghost is constrained to.
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

	removeAttributesStartingWith(ghostEl, 'data-melt-sortable');
	ghostEl.setAttribute('data-melt-sortable-ghost', '');

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
 * Determines whether the pointer is intersecting an item based on the zones orientation.
 *
 * @param {HTMLElement} el - HTMLElement to check.
 * @param {SortableGhost} ghost - Ghost element.
 * @param {PointerEvent} e - The pointer event.
 * @param {number} zoneProps - Properties of the zone.
 * @param {SortableHit | null} previousHit - A SortableHit object or null.
 * @returns {SortableIntersect} - A SortableIntersect object.
 */
export function intersect(
	el: HTMLElement,
	ghost: SortableGhost,
	e: PointerEvent,
	zoneProps: Required<SortableZoneProps>,
	previousHit: SortableHit | null
): SortableIntersect {
	return zoneProps.orientation === 'vertical' || zoneProps.orientation === 'horizontal'
		? singleOrientationIntersect(el, ghost, e, zoneProps, previousHit)
		: multiOrientationIntersect(el, ghost, e, zoneProps, previousHit);
}

/**
 * Checks if the pointer and any part of the ghost are intersecting an element for either the
 * the vertical or horizontal orientations. If a hit is detected, and there was a previous hit
 * against the same element, additional checks are performed to determine if this is still a hit.
 *
 * @param {HTMLElement} el - HTMLElement to check.
 * @param {SortableGhost} ghost - Ghost element.
 * @param {PointerEvent} e - The pointer event.
 * @param {number} zoneProps - Properties of the zone.
 * @param {SortableHit | null} previousHit - A SortableHit object or null.
 * @returns {SortableIntersect} - A SortableIntersect object.
 */
export function multiOrientationIntersect(
	el: HTMLElement,
	ghost: SortableGhost,
	e: PointerEvent,
	zoneProps: Required<SortableZoneProps>,
	previousHit: SortableHit | null
): SortableIntersect {
	if (!ghost || !ghost.bounds || zoneProps.orientation !== 'both') return { hit: false };

	// Do NOT detect hits on any item while the previous item is animating. In a grid-like layout
	// elements shift quite dramatically and it is likely the pointer will intersect another
	// item.
	if (previousHit && previousHit.el.isAnimating) {
		return { hit: false };
	}

	// Get the item bounds.
	const itemBounds = el.getBoundingClientRect();

	// Get the threshold bounds for the item
	const itemThresholds: SortableThreshold = getItemThresholds(itemBounds, zoneProps);

	// Check if the mouse is intersecting the item
	const hit =
		e.clientX >= itemThresholds.left &&
		e.clientX <= itemThresholds.right &&
		e.clientY >= itemThresholds.top &&
		e.clientY <= itemThresholds.bottom;

	if (!hit) return { hit: false };

	// Check if the ghost is also intersecting the item. This is needed when the ghost is
	// restricted to within bounds as the pointer can move freely and may intersect an item
	// without the ghost actually intersecting it.
	if (!ghostIntersect(ghost.bounds, itemBounds)) return { hit: false };

	// Get the quadrant the pointer intersected
	const quadrant: SortableQuadrant = getIntersectingQuadrant(itemBounds, e);

	// We have a hit! Skip additional checks when there was not a previous hit.
	if (!previousHit) {
		return { hit: true, quadrant };
	}

	// After moving the selected item to a new zone, the pointer may be continue to intersect
	// the same item due to elements shifting in DOM. This next hit is ignored. This block
	// will not run again.
	if (previousHit.newZone) {
		previousHit.quadrant = flipSide(quadrant, zoneProps.orientation);
		previousHit.newZone = false;
		return { hit: false };
	}

	// After the animation is complete, the pointer may be intersecting a completely different
	// item and in a new quadrant, due to how elements may shift in a grid-like layout. In this
	// case, update `previousHit` with the new element/quadrant, and ignore the hit. Future hits
	// will bypass this block and perform the additional checks.
	if (previousHit.el !== el && !previousHit.changedHitItem) {
		previousHit.el = el;
		previousHit.quadrant = quadrant;
		previousHit.changedHitItem = true;
		return { hit: false };
	}

	// Check the side the pointer is on based upon the previous hit quadrant, current pointer
	// quadrant and the orientation.
	const sameSide = inSameSide(previousHit.quadrant, quadrant, zoneProps.orientation);

	// When the hit item changed (following an animation), ignore hits while the pointer remains
	// in the same quadrant. When the quadrant changes, accept the hit and update the quadrant.
	if (sameSide && !previousHit.flipMode && previousHit.changedHitItem) {
		if (inSameQuadrant(previousHit.quadrant, quadrant)) {
			return { hit: false };
		} else {
			previousHit.quadrant = flipSide(quadrant, zoneProps.orientation);
			return { hit: true, quadrant };
		}
	}

	// After swapping items, the pointer may still be intersecting the item but on the opposite
	// side from the original hit. For example, when the previous hit occurred in the left
	// quadrant, the pointer may now be in the right quadrant. While the pointer resides in this,
	// ignore hits.
	//
	// We also set the `flipMode` flag to true so we never run the above `changedHitItem` check.
	// When we get to here, we only care about flipping from 1 side to another (ex. left to right).
	if (!inSameSide(previousHit.quadrant, quadrant, zoneProps.orientation)) {
		previousHit.flipMode = true;
		return { hit: false };
	}

	// The pointer moved to the same side as the original hit. This is a successful hit.
	//
	// We flip the quadrant side so future checks are performed against the opposite side.
	previousHit.quadrant = flipSide(quadrant, zoneProps.orientation);
	return { hit, quadrant };
}

/**
 * Checks if the pointer and any part of the ghost are intersecting an element for either the
 * the vertical or horizontal orientations. If a hit is detected, and there was a previous hit
 * against the same element, additional checks are performed to determine if this is still a hit.
 *
 * @param {HTMLElement} el - HTMLElement to check.
 * @param {SortableGhost} ghost - Ghost element.
 * @param {PointerEvent} e - The pointer event.
 * @param {number} zoneProps - Properties of the zone.
 * @param {SortableHit | null} previousHit - A SortableHit object or null.
 * @returns {SortableIntersect} - A SortableIntersect object.
 */
export function singleOrientationIntersect(
	el: HTMLElement,
	ghost: SortableGhost,
	e: PointerEvent,
	zoneProps: Required<SortableZoneProps>,
	previousHit: SortableHit | null
): SortableIntersect {
	if (!ghost || !ghost.bounds || zoneProps.orientation === 'both') return { hit: false };

	// Get the item bounds.
	const itemBounds = el.getBoundingClientRect();

	// Get the threshold bounds for the item
	const itemThresholds: SortableThreshold = getItemThresholds(itemBounds, zoneProps);

	// Check if the mouse is intersecting the item
	const hit =
		e.clientX >= itemThresholds.left &&
		e.clientX <= itemThresholds.right &&
		e.clientY >= itemThresholds.top &&
		e.clientY <= itemThresholds.bottom;

	if (!hit) return { hit: false };

	// Check if the ghost is also intersecting the item. This is needed when the ghost is
	// restricted to within bounds as the pointer can move freely and may intersect an item
	// without the ghost actually intersecting it.
	if (!ghostIntersect(ghost.bounds, itemBounds)) return { hit: false };

	// Get the quadrant the pointer intersected
	const quadrant: SortableQuadrant = getIntersectingQuadrant(itemBounds, e);

	// We have a hit!
	//
	// Skip additional checks when there was not a previous hit or the previous hit was for a
	// different element.
	if (!previousHit || previousHit.el !== el) {
		return { hit: true, quadrant };
	}

	// Scenario 1. After moving the selected item to a new zone, the pointer may be continue
	// to intersect the same item due to elements shifting in DOM. This next hit is ignored and
	// this block will not run again.
	if (previousHit.newZone) {
		previousHit.quadrant = flipSide(quadrant, zoneProps.orientation);
		previousHit.newZone = false;
		return { hit: false };
	}

	// Check the side the pointer is on based upon the previous hit quadrant, current pointer
	// quadrant and the orientation.
	const sameSide = inSameSide(previousHit.quadrant, quadrant, zoneProps.orientation);

	// Scenario 2. After swapping the selected item with the intersected item, the pointer may
	// still be intersecting the item on the same side. For example, when the zone orientation is
	// vertical and the original hit occurred in the top quadrant, the pointer may still be
	// intersecting this quadrant.
	//
	// When this occurs we create a reduced hit zone within this quadrant. This reduced hit zone
	// is calculated by determining the quadrant side (ex. top) and adding the ghost width/height
	// * 0.66.
	//
	// While the pointer is outside of this reduced hit zone but on the same side, hits are
	// ignored. When the pointer moves into this reduced hit zone, return a hit.
	if (
		sameSide &&
		!previousHit.flipMode &&
		!isInReducedHitZone(itemBounds, ghost.bounds, previousHit.quadrant, e, zoneProps.orientation)
	) {
		return { hit: false };
	}

	// Scenario 3. After swapping items, the pointer may still be intersecting the item but on the
	// opposite side from the original hit. For example, when the zone orientation is vertical and
	// the original hit occurred in the top quadrant, the pointer may now be in the bottom
	// quadrant. While the pointer resides in this opposite side, ignore hits.
	//
	// We also set the `flipMode` flag to true so the scenario 2 check (reduced hit zone) is
	// skipped. When we get to here, we only care about flipping from 1 side to another (ex.
	// top to bottom).
	if (!sameSide) {
		previousHit.flipMode = true;
		return { hit: false };
	}

	// The pointer moved to the same side as the original hit. This is a successful hit.
	//
	// We flip the quadrant side so future checks are performed against the opposite side.
	previousHit.quadrant = flipSide(quadrant, zoneProps.orientation);
	return { hit, quadrant };
}

/**
 * A reduced intersection check. It checks if the pointer and any part of the ghost are
 * intersecting an element.
 *
 * @param {HTMLElement} el - The element to check for intersection.
 * @param {SortableGhost} ghost - The ghost element to check for intersection.
 * @param {PointerEvent} e - The pointer event to check for intersection.
 * @returns {boolean} - True if there is an intersection, false otherwise.
 */
export function simpleIntersect(el: HTMLElement, ghost: SortableGhost, e: PointerEvent): boolean {
	if (!ghost || !ghost.bounds) return false;

	const itemBounds = el.getBoundingClientRect();

	const hit =
		e.clientX >= itemBounds.left &&
		e.clientX <= itemBounds.right &&
		e.clientY >= itemBounds.top &&
		e.clientY <= itemBounds.bottom;

	if (!hit) return false;

	// Check if the ghost is also intersecting the item. This is needed when the ghost is
	// restricted to within bounds as the pointer can move freely and may intersect an item
	// without the ghost actually intersecting it.
	if (!ghostIntersect(ghost.bounds, itemBounds)) return false;

	return true;
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
 * Translates the position of a SortableGhost element based on a pointer event.
 *
 * @param {SortableGhost} ghost - The element to be translated.
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
 * Moves an element to before/after another element.
 *
 * @param {HTMLElement} moveEl - The element to move.
 * @param {HTMLElement} itemEl - The static element to move the moveEl before/after.
 * @param {boolean} after - A boolean indicating whether the selected item should be placed before
 * or after itemEl.
 */
export function moveEl(moveEl: HTMLElement, itemEl: HTMLElement, after: boolean) {
	const parent = itemEl.parentNode;
	if (!parent) return;
	parent.insertBefore(moveEl, after ? itemEl.nextSibling : itemEl);
}

/**
 * Determines if a zone support the dropping of an item.
 *
 * @param {string} originZone - The origin zone. This is likely the origin zone of the selected
 * item.
 * @param {string} zone - The zone to check against. This is likely the zone the pointer is in.
 * @param {'*' | '-' | string[]} zones - The allowed zones.
 * @returns {boolean} - True if the zone is supported, false otherwise.
 */
export function isSupportedZone(
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
 * Checks if part of the ghost bounds are intersecting with the item bounds.
 *
 * @param {DOMRect} ghostBounds - The bounding rectangle of the ghost.
 * @param {DOMRect} itemBounds - The bounding rectangle of the item.
 * @returns {boolean} - True if there is an intersection, otherwise false.
 */
function ghostIntersect(ghostBounds: DOMRect, itemBounds: DOMRect) {
	return (
		ghostBounds.left < itemBounds.right &&
		ghostBounds.right > itemBounds.left &&
		ghostBounds.top < itemBounds.bottom &&
		ghostBounds.bottom > itemBounds.top
	);
}

/**
 * Flips the side of the given quadrant.
 *
 * @param {SortableQuadrant} quadrant - The quadrant to flip the side of.
 * @param {SortableOrientation} orientation - Which side to flip.
 * @returns {SortableQuadrant} - The flipped quadrant.
 */
function flipSide(quadrant: SortableQuadrant, orientation: SortableOrientation): SortableQuadrant {
	return orientation === 'vertical'
		? { ...quadrant, vertical: quadrant.vertical === 'top' ? 'bottom' : 'top' }
		: { ...quadrant, horizontal: quadrant.horizontal === 'left' ? 'right' : 'left' };
}

/**
 * Creates threshold values for an item based on its bounds and zone threshold + orientation.
 *
 * @param {DOMRect} itemBounds - The bounding rectangle of the item.
 * @param {Required<SortableZoneProps>} zoneProps - Required properties of the sortable zone,
 * namely the threshold and orientation.
 * @returns {SortableThreshold} - An object containing the top, bottom, left, and right
 * thresholds for the item.
 */
function getItemThresholds(
	itemBounds: DOMRect,
	zoneProps: Required<SortableZoneProps>
): SortableThreshold {
	// Default the threshold to the entire item bounds.
	const itemThreshold: SortableThreshold = {
		top: itemBounds.top,
		bottom: itemBounds.bottom,
		left: itemBounds.left,
		right: itemBounds.right,
	};

	// Get the middle of the item.
	let middleWidth = itemBounds.left + itemBounds.width / 2;
	let middleHeight = itemBounds.top + itemBounds.height / 2;

	// Set the middle, top and bottom thresholds.
	if (zoneProps.orientation === 'vertical' || zoneProps.orientation === 'both') {
		const heightThreshold = (itemBounds.height * zoneProps.threshold) / 2;
		middleHeight = itemBounds.top + itemBounds.height / 2;
		itemThreshold.top = middleHeight - heightThreshold;
		itemThreshold.bottom = middleHeight + heightThreshold;
	}

	// Set the middle, left and right thresholds.
	if (zoneProps.orientation === 'horizontal' || zoneProps.orientation === 'both') {
		const widthThreshold = (itemBounds.width * zoneProps.threshold) / 2;
		middleWidth = itemBounds.left + itemBounds.width / 2;
		itemThreshold.left = middleWidth - widthThreshold;
		itemThreshold.right = middleWidth + widthThreshold;
	}

	return itemThreshold;
}

/**
 * Check which quadrant the pointer is in relative to the item.
 *
 * @param {DOMRect} itemBounds - The bounding rectangle of an item.
 * @param {PointerEvent} e - The pointer event.
 * @returns {SortableQuadrant} - An object containing the vertical and horizontal quadrant of the
 * intersection.
 */
function getIntersectingQuadrant(itemBounds: DOMRect, e: PointerEvent): SortableQuadrant {
	const isTopHalf = e.clientY < itemBounds.top + itemBounds.height / 2;
	const isLeftHalf = e.clientX < itemBounds.left + itemBounds.width / 2;

	return {
		vertical: isTopHalf ? 'top' : 'bottom',
		horizontal: isLeftHalf ? 'left' : 'right',
	};
}

/**
 * Checks if the quad1 and quad2 are the same.
 *
 * @param {SortableQuadrant} quad1 - Quadrant 1.
 * @param {SortableQuadrant} quad2 - Quadrant 2.
 * @returns {boolean} - True if the quadrants are the same, false otherwise.
 */
function inSameQuadrant(previousQuadrant: SortableQuadrant, pointerQuadrant: SortableQuadrant) {
	return (
		previousQuadrant.vertical === pointerQuadrant.vertical &&
		previousQuadrant.horizontal === pointerQuadrant.horizontal
	);
}

/**
 * Determines if quad1 is on the same side of quad2 based on orientation.
 *
 * @param {SortableQuadrant} quad1 - Quadrant 1.
 * @param {SortableQuadrant} quad2 - Quadrant 2.
 * @param {SortableOrientation} orientation - Orientation.
 * @returns {boolean} - True if the quadrants are on the same side, false otherwise.
 */
function inSameSide(
	quad1: SortableQuadrant,
	quad2: SortableQuadrant,
	orientation: SortableOrientation
) {
	if (orientation === 'vertical') {
		return quad1.vertical === quad2.vertical;
	}

	return quad1.horizontal === quad2.horizontal;
}

/**
 * Checks if the pointer is within a reduced hit zone.
 *
 * @param {DOMRect} itemBounds - The bounds of the item.
 * @param {DOMRect} ghostBounds - The bounds of the ghost element.
 * @param {SortableQuadrant} quadrant - The quadrant of the item.
 * @param {PointerEvent} e - The pointer event.
 * @param {SortableOrientation} orientation - The orientation.
 * @returns {boolean} - True if the pointer event is within the reduced hit zone, false otherwise.
 */
function isInReducedHitZone(
	itemBounds: DOMRect,
	ghostBounds: DOMRect,
	quadrant: SortableQuadrant,
	e: PointerEvent,
	orientation: SortableOrientation
) {
	const topThreshold = itemBounds.top + ghostBounds.height * 0.66;
	const bottomThreshold = itemBounds.bottom - ghostBounds.height * 0.66;
	const leftThreshold = itemBounds.left + ghostBounds.width * 0.66;
	const rightThreshold = itemBounds.right - ghostBounds.width * 0.66;

	if (orientation === 'vertical') {
		if (
			(quadrant.vertical === 'top' && e.clientY <= topThreshold) ||
			(quadrant.vertical === 'bottom' && e.clientY >= bottomThreshold)
		) {
			return true;
		}
	} else {
		if (
			(quadrant.horizontal === 'left' && e.clientX <= leftThreshold) ||
			(quadrant.horizontal === 'right' && e.clientX >= rightThreshold)
		) {
			return true;
		}
	}

	return false;
}
