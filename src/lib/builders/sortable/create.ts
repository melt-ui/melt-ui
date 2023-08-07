import {
	animate,
	getState,
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	toWritableStores,
	type AnimationElement,
} from '$lib/internal/helpers';
import type { Defaults, MeltActionReturn } from '$lib/internal/types';
import { get, writable } from 'svelte/store';
import type { SortableEvents } from './events';
import { createGhostEl, intersect, moveSelected, supportedZone, translate } from './helpers';
import type {
	CreateSortableProps,
	SelectedItem,
	SortableGhost,
	SortableItemProps,
	SortableOrientation,
	SortablePointerZone,
	SortableQuadrant,
	SortableZoneProps,
} from './types';

const defaults = {
	animationDuration: 150,
	animationEasing: 'ease-out',
} satisfies Defaults<CreateSortableProps>;

type SortableParts = 'zone' | 'item' | 'handle';
const { name, selector } = createElHelpers<SortableParts>('sortable');

export function createSortable(props?: CreateSortableProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateSortableProps;

	const options = toWritableStores(withDefaults);

	const { animationDuration, animationEasing } = options;

	// The target item within a zone. It holds information about the item as it is being
	// moved within a zone or between zones.
	const selected = writable<SelectedItem | null>(null);

	// The Ghost store.
	const ghost = writable<SortableGhost | null>(null);

	// Holds properties for each zone, whereby the key is the zone id.
	const zoneProps: Record<string, Required<SortableZoneProps>> = {};

	// Populated during the `pointerdown` and `mouseenter` events. It holds information about
	// the zone the pointer is currently in. When the pointer leaves a zone or it is released,
	// this is set to null.
	let pointerZone: SortablePointerZone | null = null;

	// Set when the selected item changes zone. Following this change, the pointer may continue
	// to intersect with an item, causing weird behavior. This object is used to, stop that. It
	// is cleared when the pointer begins to intersect with another item or is released.
	let zoneChange: { el: HTMLElement; quadrant: SortableQuadrant } | null = null;

	// Set when an animation begins. It holds the element that the pointer intersected with and
	// is used to stop future intersections with that element, while it is the last intersected
	// Item. As the pointer intersects with other elements, this is set
	let animatedIntersectItem: AnimationElement | null = null;

	const zone = builder(name('zone'), {
		returned: () => {
			return (props: SortableZoneProps) => {
				zoneProps[props.id] = {
					...props,
					id: props.id,
					orientation: props.orientation,
					disabled: props.disabled ?? false,
					dropzone: props.dropzone ?? false,
					threshold: Math.max(0, Math.min(props?.threshold ?? 0.95, 1)),
					fromZones: props.fromZones ?? '-',
					axis: props.axis ?? 'both',
					restrictTo: props.restrictTo ?? 'body',
				};

				return {
					'data-melt-zone-id': props.id,
					'data-melt-zone-orientation': props.orientation,
					'data-melt-zone-disabled': props.disabled ? true : undefined,
					'data-melt-zone-dropzone': props.dropzone ? true : undefined,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<SortableEvents['zone']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', (e) => {
					// Ignore right click
					if (e.button === 2) return;

					const zoneId = node.getAttribute('data-melt-zone-id');
					if (!zoneId) return;

					const props = zoneProps[zoneId];
					if (!zoneProps) return;

					// Do nothing when disabled or a dropzone.
					if (props.disabled || props.dropzone) return;

					// Get items in this zone
					const items: HTMLElement[] = Array.from(node.querySelectorAll(selector('item')));
					if (items.length === 0) return;

					// Check if target is a sortable item
					const targetedItem = items.find((item) => item.contains(e.target as HTMLElement));
					if (!targetedItem) return;

					// Check if this item has a handle and if so, was it the target
					const hasHandle = targetedItem.querySelector(selector('handle'));
					if (hasHandle && !hasHandle.contains(e.target as HTMLElement)) return;

					// Ignore when the target is disabled
					if (targetedItem.hasAttribute('data-melt-item-disabled')) return;

					// Store information about this pointer zone
					pointerZone = { id: zoneId, el: node, items: items };

					// Set the selected item
					selected.set({
						id: targetedItem.getAttribute('data-melt-item-id') ?? '0',
						zone: zoneId,
						originZone: zoneId,
						zoneEl: node,
						disabled: false,
						el: targetedItem,
					});

					// Create a ghost. This should be done before any data attributes are set
					// on the targeted item.
					const g = createGhostEl(targetedItem, e, props);
					ghost.set(g);

					// Set item dragging attribute
					targetedItem.setAttribute('data-melt-item-dragging', '');
				}),
				addMeltEventListener(node, 'mouseenter', async () => {
					const zoneId = node.getAttribute('data-melt-zone-id');
					if (!zoneId) return;

					const props = zoneProps[zoneId];
					if (!zoneProps) return;

					// Do nothing when the zone is disabled
					if (props.disabled) return;

					// Do nothing when an item is not selected
					const $selected = get(selected);
					if (!$selected) return;

					// Check if this zone supports dropping the item.
					if (!supportedZone($selected.originZone, zoneId, props.fromZones)) return;

					// Store information about this pointer zone
					pointerZone = {
						id: zoneId,
						el: node,
						items: Array.from(node.querySelectorAll(selector('item'))),
					};

					if (props.dropzone) node.setAttribute('data-melt-zone-dropzone-hover', '');
				}),
				addMeltEventListener(node, 'mouseleave', async () => {
					pointerZone = null;
					zoneChange = null;
					node.removeAttribute('data-melt-zone-dropzone-hover');
				})
			);
			return {
				destroy: unsub,
			};
		},
	});

	const item = builder(name('item'), {
		returned: () => {
			return (props: SortableItemProps) => {
				return {
					'data-melt-item-id': props.id,
					'data-melt-item-disabled': props.disabled ? true : undefined,
				} as const;
			};
		},
	});

	const handle = builder(name('handle'), {
		returned: () => {
			return {};
		},
	});

	// This effect runs when an item is selected, resulting in a ghost. The effect handles
	// pointermove and pointerup events.
	//
	// - During pointermove events the ghost position is updated to follow the mouse and checks
	//   are carried out to see if the mouse is intersecting an item.
	// - During pointerup events the ghost is removed and additional cleanup is done.
	effect(ghost, ($ghost) => {
		if (!$ghost) return;

		// Define the event listeners
		const handlePointerMove = (e: PointerEvent) => {
			e.preventDefault();

			// Always update the ghost position
			translate($ghost, e);

			// Do nothing when outside a zone or in an unsupported zone
			if (!pointerZone) return;

			// Get the selected item
			const $selected = get(selected);
			if (!$selected) return;

			// Get the zone properties
			const props = zoneProps[pointerZone.id];
			if (!props) return;

			// True when the selected item within the same zone
			const isSameZone = $selected.zone === pointerZone.id;

			// When this is an empty zone or it's a dropzone, add the selected item to the end
			if (pointerZone.items.length === 0 || props.dropzone) {
				// Do nothing when the item has already been moved to this zone
				if (isSameZone) return;

				// Attempts to move the item to the end of the zone if the pointer intersects
				// with the zone
				moveToEnd(e, props);

				return;
			}

			// If the pointer is in the same zone as the selected item, do a quick check to see if
			// the pointer is is intersecting. This stops doing potentially more checks.
			//
			// When there is a hit, we also clear `zoneChange` as the pointer is now on the selected
			// item, so we can resume normal intersection checks.
			if (isSameZone) {
				const { hit } = intersect($selected.el, $ghost, e, 1, props.orientation);
				if (hit) {
					zoneChange = null;
					return;
				}
			}

			// This loops through all the items in `pointerZone` and checks if the pointer is
			// intersecting with any items

			for (const [index, item] of pointerZone.items.entries()) {
				// Ignore the selected item as it was checked above
				if ($selected.el === item) continue;

				// Ignore the last intersected item when it's animating. This is set when the
				// pointer intersects with an item, starting an animation. This stops the pointer
				// intersecting with the item as it animates.

				if (
					animatedIntersectItem &&
					animatedIntersectItem.isAnimating &&
					animatedIntersectItem === item
				) {
					continue;
				}

				// Check this item for a pointer intersection
				const { hit, quadrant } = intersect(item, $ghost, e, props.threshold, props.orientation);

				if (hit && quadrant) {
					if (zoneChangeCheck(item, props.orientation, quadrant)) {
						return;
					}

					moveItem(item, index, quadrant, props.orientation);

					return;
				}
			}
		};

		const handlePointerUp = () => {
			cleanup();
		};

		const cleanup = () => {
			// Remove the ghost
			$ghost.el.remove();
			ghost.set(null);

			// Clean up the pointer zone
			pointerZone?.el.removeAttribute('data-melt-zone-dropzone-hover');
			pointerZone = null;

			animatedIntersectItem = null;
			zoneChange = null;

			// Update selected item attributes and remove from store
			const $selected = get(selected);
			if ($selected) {
				$selected.el.removeAttribute('data-melt-item-dragging');
				selected.set(null);
			}

			// Cleanup even listeners
			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', handlePointerUp);
		};

		// Add event listeners
		document.addEventListener('pointermove', handlePointerMove);
		document.addEventListener('pointerup', handlePointerUp);

		// Cleanup when the component is destroyed
		return () => {
			cleanup();
		};
	});

	/**
	 * Moves an item within a zone or to a new zone
	 *
	 * @param {HTMLElement} item - The item the mouse is intersecting with.
	 * @param {number} newIndex - The new position for the item within the zone.
	 * @param {Quadrant} quadrant - The quadrant the intersection took place in.
	 * @param {SortableOrientation} orientation - The orientation of the zone.
	 */
	function moveItem(
		item: HTMLElement,
		newIndex: number,
		quadrant: SortableQuadrant,
		orientation: SortableOrientation
	) {
		if (!pointerZone) return;

		// Get the selected item
		const $selected = get(selected);
		if (!$selected) return;

		// Get the animation state for the involved zones
		const animationState = getAnimationStateForZones(pointerZone, $selected);

		// if   - Move selected within zone and update pointer items array
		// else - Move selected to new zone and update origin/pointer items array
		if ($selected.zone === pointerZone.id) {
			const index = pointerZone.items.indexOf($selected.el);
			pointerZone.items.splice(index, 1);
			pointerZone.items.splice(newIndex, 0, $selected.el as HTMLElement);
			moveSelected($selected.el, item, index < newIndex);
		} else {
			// Whether to insert the selected item before or after the intersected item
			let after = true;

			if (orientation === 'vertical') {
				if (quadrant.vertical === 'top') {
					newIndex === 0
						? pointerZone.items.unshift($selected.el)
						: pointerZone.items.splice(newIndex, 0, $selected.el);
					after = false;
				} else {
					newIndex === pointerZone.items.length - 1
						? pointerZone.items.push($selected.el)
						: pointerZone.items.splice(newIndex + 1, 0, $selected.el);
				}
			} else if (orientation === 'horizontal') {
				if (quadrant.horizontal === 'left') {
					newIndex === 0
						? pointerZone.items.unshift($selected.el)
						: pointerZone.items.splice(newIndex, 0, $selected.el);
					after = false;
				} else {
					newIndex === pointerZone.items.length - 1
						? pointerZone.items.push($selected.el)
						: pointerZone.items.splice(newIndex + 1, 0, $selected.el);
				}
			}
			$selected.zone = pointerZone.id;
			$selected.zoneEl = pointerZone.el;
			moveSelected($selected.el, item, after);

			// This is a zone change. Store so we can ignore future intersections with this
			// item until the pointer leaves the quadrant.
			zoneChange = { el: item, quadrant };
		}

		// Do the animation if we have state
		if (animationState) {
			animatedIntersectItem = item;
			animate(animationState, get(animationDuration), get(animationEasing));
		}
	}

	/**
	 * Moves the selected element to the end of the sortable zone. This should only be called
	 * when the zone is empty or it is a dropzone. It checks to see if the pointer is intersecting
	 * with the zone (as opposed to an item).
	 *
	 * @param {PointerEvent} e - The pointer event.
	 * @param {Required<SortableZoneProps>} zoneProps - The required sortable zone properties.
	 */
	function moveToEnd(e: PointerEvent, zoneProps: Required<SortableZoneProps>) {
		if (!pointerZone) return;

		const $ghost = get(ghost);
		if (!$ghost) return;

		const $selected = get(selected);
		if (!$selected) return;

		const { hit } = intersect(
			pointerZone.el,
			$ghost,
			e,
			zoneProps.threshold,
			zoneProps.orientation
		);

		if (!hit) return;

		// Get the animation state for the involved zones
		const animationState = getAnimationStateForZones(pointerZone, $selected);

		// Update the pointer zone to include the item
		$selected.zone = pointerZone.id;

		pointerZone.items.push($selected.el);
		pointerZone.el.appendChild($selected.el);

		// Do the animation if we have state
		if (animationState) {
			// animatedIntersectItem = item;
			animate(animationState, get(animationDuration), get(animationEasing));
		}
	}

	/**
	 * Gets the current (FLIP) state for items in the pointer zone and items the the selected
	 * item resides in (if different).
	 *
	 * @returns {FlipState|null} - The current state of items in this zone, or null
	 */
	function getAnimationStateForZones(pointerZone: SortablePointerZone, selected: SelectedItem) {
		if (!selected) return null;

		const $animationDuration = get(animationDuration);
		if ($animationDuration <= 0) return null;

		const itemsToAnimate = [...(pointerZone.items as Element[])];
		if (selected.zone !== pointerZone.id) {
			itemsToAnimate.push(...Array.from(selected.zoneEl.querySelectorAll(selector('item'))));
		}

		return getState(itemsToAnimate);
	}

	/**
	 * Checks if an item as recently changed zones. If so it compared the zone orientation
	 * to see if the pointer is in the same quadrant.
	 *
	 * For example, if the orientation is vertical and the pointer is in the top half, return
	 * true while the intersection continues to be in the top half. This stop flickering items
	 * when they are moved to a new zone.
	 *
	 * @param {HTMLElement} item - The HTML element representing the item that was intersected.
	 * @param {SortableOrientation} orientation - The orientation of the zone.
	 * @param {SortableQuadrant} quadrant - The quadrant the pointer is in.
	 * @returns {boolean} - True if there is a zone change, false otherwise.
	 */
	function zoneChangeCheck(
		item: HTMLElement,
		orientation: SortableOrientation,
		quadrant: SortableQuadrant
	) {
		// Do nothing when there is no zone change
		if (zoneChange && item === zoneChange.el) {
			if (
				(orientation === 'vertical' && zoneChange.quadrant.vertical === quadrant.vertical) ||
				(orientation === 'horizontal' && zoneChange.quadrant.horizontal === quadrant.horizontal) ||
				(orientation === 'both' && zoneChange.quadrant === quadrant)
			) {
				return true;
			}
		}

		zoneChange = null;
		return false;
	}

	return {
		elements: {
			zone,
			item,
			handle,
		},
		options,
	};
}
