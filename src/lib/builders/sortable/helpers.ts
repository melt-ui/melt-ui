import {
	calculateInverseScale,
	clamp,
	removeAttributesStartingWith,
} from '$lib/internal/helpers/index.js';
import type {
	SortableBounds,
	SortableGhost,
	SortableHit,
	SortableIntersect,
	SortableOrientation,
	SortableQuadrant,
	SortableSelected,
	SortableThreshold,
	SortableZoneProps,
} from './types.js';

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

	removeAttributesStartingWith(ghostEl, ['data-melt-sortable', 'data-sortable'], true);
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
 * A simple intersection check. It checks if the pointer and any part of the ghost are
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
 * An extended intersection check. It calls singleOrientationIntersect or multiOrientationIntersect
 * based upon the orientation
 * @param {SortableSelected} selected - Currently selected element.
 * @param {HTMLElement} el - HTMLElement to check.
 * @param {SortableGhost} ghost - Ghost element.
 * @param {PointerEvent} e - The pointer event.
 * @param {number} zoneProps - Properties of the zone.
 * @param {SortableHit | null} previousHit - A SortableHit object or null.
 * @returns {SortableIntersect} - A SortableIntersect object.
 */
export function extendedIntersect(
	selected: SortableSelected,
	el: HTMLElement,
	ghost: SortableGhost,
	e: PointerEvent,
	zoneProps: Required<SortableZoneProps>,
	previousHit: SortableHit | null
): SortableIntersect {
	return zoneProps.orientation === 'vertical' || zoneProps.orientation === 'horizontal'
		? singleOrientationIntersect(selected, el, ghost, e, zoneProps, previousHit)
		: multiOrientationIntersect(selected, el, ghost, e, zoneProps, previousHit);
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
 * Get all items in a zone. When nesting is disabled all nested items are removed.
 *
 * @param {HTMLElement} el - The parent zone element.
 * @param {SortableZoneProps} props - The props object for the sortable zone.
 * @param {string} selector - The selector string to select the items in the zone.
 * @returns {HTMLElement[]} - An array of HTMLElements representing the items in the zone.
 */
export function getZoneItems(
	el: HTMLElement,
	props: Required<SortableZoneProps>,
	selector: string
) {
	// Get items in this zone
	let items: HTMLElement[] = Array.from(el.querySelectorAll(selector));
	if (items.length === 0) return [];

	if (!props.nesting) {
		items = items.filter((item) => {
			return !items.some((parentElement) => {
				return parentElement !== item && parentElement.contains(item);
			});
		});
	}

	return items;
}

/**
 * Get the targeted item in a sortable zone based. Events are at the zone level. For this reason
 * when a used clicks in a zone, we need to determine if they are targeting a sortable item.
 *
 * @param {HTMLElement} targetEl - The target element.
 * @param {string} selector - The selector string to select the targeted item.
 * @param {HTMLElement[]} items - An array of HTMLElements representing the items in the sortable zone.
 * @returns {HTMLElement|null} - The targeted item as an HTMLElement or null if not found.
 */
export function getTargetItem(targetEl: HTMLElement, selector: string, items: HTMLElement[]) {
	// Check if target is a sortable item
	let targetedItem = targetEl.closest<HTMLElement>(selector);
	if (!targetedItem) return null;

	// The target may be a nested item. If it is then we need to try and find it's parent and set
	// that as the targeted item.
	if (!items.includes(targetedItem)) {
		targetedItem =
			items.find((item) => {
				return item.contains(targetedItem);
			}) ?? null;
	}

	return targetedItem;
}

/**
 * Find the index of the deepest child for a given parent element and its last direct descendant.
 * This is used where items are nested in other items. The items are kept in a flat array and
 * this function is used to determine the index of the deepest child for a given parent.
 *
 * @param {HTMLElement[]} items - The flat array of DOM elements.
 * @param {HTMLElement} parentEl - The parent element for which to find the deepest child.
 * @returns {Result} - The index of the deepest child and the last direct descendant.
 */
export function findDeepestChild(
	items: HTMLElement[],
	parentEl: HTMLElement
): {
	deepestChildIndex: number;
	lastDirectDescendant: HTMLElement | null;
} {
	const parentIndex = items.indexOf(parentEl);
	let deepestChildIndex = parentIndex;
	let lastDirectDescendant: HTMLElement | null = null;
	let hasChildren = false;

	for (let i = parentIndex + 1; i < items.length; i++) {
		if (parentEl.contains(items[i])) {
			deepestChildIndex = i;
			hasChildren = true;
			if (items[i].parentElement === parentEl) {
				lastDirectDescendant = items[i];
			}
		} else {
			break;
		}
	}

	if (!hasChildren) {
		lastDirectDescendant = null;
	}

	return {
		deepestChildIndex,
		lastDirectDescendant,
	};
}

/**
 * Find the first direct child for a given parent element.
 *
 * @param {HTMLElement[]} elements - The flat array of DOM elements.
 * @param {HTMLElement} parentEl - The parent element for which to find the first child.
 * @returns {HTMLElement | null} - The first direct child or null if not found.
 */
export function findFirstChild(elements: HTMLElement[], parentEl: HTMLElement): HTMLElement | null {
	const parentIndex = elements.indexOf(parentEl);

	for (let i = parentIndex + 1; i < elements.length; i++) {
		if (elements[i].parentElement === parentEl) {
			return elements[i];
		}
		if (!parentEl.contains(elements[i])) {
			break;
		}
	}

	return null;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// PRIVATE
///////////////////////////////////////////////////////////////////////////////////////////////////

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
 * Checks if the pointer and any part of the ghost are intersecting an element for either the
 * the vertical or horizontal orientations. If a hit is detected, and there was a previous hit
 * against the same element, additional checks are performed to determine if this is still a hit.
 *
 * @param {SortableSelected} selected - Currently selected element.
 * @param {HTMLElement} el - HTMLElement to check.
 * @param {SortableGhost} ghost - Ghost element.
 * @param {PointerEvent} e - The pointer event.
 * @param {number} zoneProps - Properties of the zone.
 * @param {SortableHit | null} previousHit - A SortableHit object or null.
 * @returns {SortableIntersect} - A SortableIntersect object.
 */
function singleOrientationIntersect(
	selected: SortableSelected,
	el: HTMLElement,
	ghost: SortableGhost,
	e: PointerEvent,
	zoneProps: Required<SortableZoneProps>,
	previousHit: SortableHit | null
): SortableIntersect {
	if (!ghost || !ghost.bounds || zoneProps.orientation === 'both') return { hit: false };

	// When nesting is enabled, skip checks when the pointer is intersecting a nested child. This
	// can happen when items shift around and the pointer ends up intersecting a nested child.
	if (zoneProps.nesting) {
		if (selected.isNestingItems && selected.el.contains(el)) {
			return { hit: false };
		}

		if (selected.el.isAnimating && el.contains(selected.el)) {
			return { hit: false };
		}
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

	///////////////////////////////////////////////////////////////////////////
	// We have a hit!
	///////////////////////////////////////////////////////////////////////////

	// Get the quadrant the pointer intersected
	const quadrant: SortableQuadrant = getIntersectingQuadrant(itemBounds, e);

	// Scenario 1. Nesting is enabled and a hit took place on the parent. There are several
	// factors to take care of.
	//
	// 1. If the selected item was just moved into a new parent, due to shifting, future hits may
	//    occur in the reduced hit zone. We take care of this by setting the `newParent` flag to
	//    true. When this is true, any hits that occur in the reduced hit zone are ignored. When
	//    the pointer moves outside of the reduced hit zone, the `newParent` flag is set to false
	//    and future checks are performed.
	// 2. The selected item is nested and the hit occurred in the reduced hit zone. We return a
	//    hit and the selected item will be moved outside of this hit item.
	// 3. Hits outside of the reduced hit zone are ignored. Say there are 2 nested items within the
	//    parent with a gap between them. As the pointer moves it may intersect this gap causing a
	//    hit. We ignore this and only care about hits within the reduced hit zone.
	if (zoneProps.nesting && selected.nestedParentEl && el === selected.nestedParentEl) {
		const inReducedHitZone = isInReducedHitZone(
			itemBounds,
			ghost.bounds,
			quadrant,
			e,
			zoneProps.orientation,
			0.33
		);

		if (previousHit && previousHit.el === el && previousHit.newParent) {
			// The selected item was moved into a new parent. Ignore hits while the pointer is in
			// the reduced hit zone. When the pointer moves outside of the reduced hit zone, the
			// `newParent` flag is set to false and future checks will be performed.
			if (inReducedHitZone) {
				return { hit: false, stopChecking: true };
			} else {
				previousHit.newParent = false;
				return { hit: false, stopChecking: true };
			}
		} else if (inReducedHitZone) {
			// The selected item is nested and the pointer is in the reduced hit zone. This hit
			// will result in the selected item moving outside of this hit item
			return { hit: true, quadrant };
		}

		// Ignore all other hits on this parent item
		return { hit: false, stopChecking: true };
	}

	// Scenario 2. When there was no previous hit OR the hit occurred on a different element, this
	// is a successful hit and future checks can be skipped
	if (!previousHit || previousHit.el !== el) {
		return { hit: true, quadrant };
	}

	// Scenario 3. After moving the selected item to a new zone or group, the pointer may be
	// continue to intersect the same item due to elements shifting in DOM. We update the
	// current intersecting quadrant to be the opposite side, and return an `no hit`. In addition
	// the `newZone` flag is set to false so this block does not run again.
	//
	// This means future checks will only result in a successful hit when the pointer moves to the
	// opposite quadrant.
	if (previousHit.newZone) {
		previousHit.quadrant = flipSide(quadrant, zoneProps.orientation);
		previousHit.newZone = false;
		return { hit: false, stopChecking: true };
	}

	// Check the side the pointer is on based upon the previous hit quadrant, current pointer
	// quadrant and the orientation.
	const sameSide = inSameSide(previousHit.quadrant, quadrant, zoneProps.orientation);

	// Scenario 4. After swapping the selected item with the intersected item, due to the size of
	// elements, the pointer may still be intersecting the item on the same side. For example, when
	// the zone orientation is vertical and the original hit occurred in the top quadrant, the
	// pointer may still be intersecting this quadrant.
	//
	// When this occurs we create a reduced hit zone within this quadrant. This reduced hit zone
	// is calculated by determining the quadrant side (ex. top) and adding the ghost width/height
	// * 0.66.
	//
	// While the pointer is outside of this reduced hit zone but on the same side, hits are
	// ignored. When the pointer moves into this reduced hit zone, return a hit.
	//
	// This scenario is skipped when the `flipMode` flag is true. This flag will be true when the
	// the pointer moves from 1 side to another (ex. top to bottom). When this occurs we no longer
	// care about the reduced hit zone and only care about the pointer moving from 1 side to
	// another.
	if (
		sameSide &&
		!previousHit.flipMode &&
		!isInReducedHitZone(itemBounds, ghost.bounds, previousHit.quadrant, e, zoneProps.orientation)
	) {
		return { hit: false, stopChecking: true };
	}

	// Scenario 5. After swapping the selected item with the intersected item, due to the size of
	// elements, the pointer may still be intersecting the item but on the opposite side from the
	// original hit. For example, when the zone orientation is vertical and the original hit
	// occurred in the top quadrant, the pointer may now be in the bottom quadrant. While the
	// pointer resides in this opposite side, ignore hits.
	//
	// We also set the `flipMode` flag to true so the scenario 4 check (reduced hit zone) is
	// skipped. When we get to here, we only care about flipping from 1 side to another (ex. top
	// to bottom).
	if (!sameSide) {
		previousHit.flipMode = true;
		return { hit: false, stopChecking: true };
	}

	// At this point we have a successful hit. To be on the safe side, flip the quadrant side so
	// future checks are performed against the opposite side in the scenario that future
	// intersections occur for the same item.
	previousHit.quadrant = flipSide(quadrant, zoneProps.orientation);
	return { hit, quadrant };
}

/**
 * Checks if the pointer and any part of the ghost are intersecting an element for either the
 * the vertical or horizontal orientations. If a hit is detected, and there was a previous hit
 * against the same element, additional checks are performed to determine if this is still a hit.
 *
 * @param {SortableSelected} selected - Currently selected element.
 * @param {HTMLElement} el - HTMLElement to check.
 * @param {SortableGhost} ghost - Ghost element.
 * @param {PointerEvent} e - The pointer event.
 * @param {number} zoneProps - Properties of the zone.
 * @param {SortableHit | null} previousHit - A SortableHit object or null.
 * @returns {SortableIntersect} - A SortableIntersect object.
 */
function multiOrientationIntersect(
	selected: SortableSelected,
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
	orientation: SortableOrientation,
	amount = 0.66
) {
	const topThreshold = itemBounds.top + ghostBounds.height * amount;
	const bottomThreshold = itemBounds.bottom - ghostBounds.height * amount;
	const leftThreshold = itemBounds.left + ghostBounds.width * amount;
	const rightThreshold = itemBounds.right - ghostBounds.width * amount;

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
