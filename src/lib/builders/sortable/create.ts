import {
	addMeltEventListener,
	animate,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	getState,
	isBrowser,
	throttle,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { get, writable } from 'svelte/store';
import type { SortableEvents } from './events';
import {
	createGhostEl,
	intersect,
	isSupportedZone,
	moveEl,
	simpleIntersect,
	translate,
} from './helpers.js';
import type {
	CreateSortableProps,
	SortableGhost,
	SortableHit,
	SortableItemProps,
	SortableOrientation,
	SortablePointerZone,
	SortableQuadrant,
	SortableSelected,
	SortableZoneProps,
} from './types.js';

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
	const selected = writable<SortableSelected | null>(null);

	// The Ghost store.
	const ghost = writable<SortableGhost | null>(null);

	// Holds properties for each zone, whereby the key is the zone id.
	const zoneProps: Record<string, Required<SortableZoneProps>> = {};

	// Set during a zonal `pointerdown` or `mouseenter` event. It holds information about the
	// zone the pointer is currently in. When the pointer leaves a zone or the pointer is released,
	// it is set to null.
	let pointerZone: SortablePointerZone | null = null;

	// Set when the selected item intersects another item and triggers a hit. This object will
	// hold the item that was hit and the quadrant within that item.
	//
	// When the selected item moves, the pointer may continue to intersect with the item based
	// upon dimensions, threshold, etc. This object is used in future intersection check. It is
	// cleared when the pointer begins to intersect with another item or the pointer is released.
	let previousHitItem: SortableHit | null = null;

	let returningHome: { el: HTMLElement } | null = null;

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
					'data-melt-sortable-zone-id': props.id,
					'data-melt-sortable-zone-orientation': props.orientation,
					'data-melt-sortable-zone-disabled': props.disabled ? true : undefined,
					'data-melt-sortable-zone-dropzone': props.dropzone ? true : undefined,
					// style: props.disabled ? undefined : 'touch-action: none;',
				};
			};
		},
		action: (node: HTMLElement): MeltActionReturn<SortableEvents['zone']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', (e) => {
					console.log('POINTER DOWN');
					// Ignore right click and multi-touch on mobile
					if (e.button === 2 || !e.isPrimary) return;

					const zoneId = node.getAttribute('data-melt-sortable-zone-id');
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
					if (targetedItem.hasAttribute('data-melt-sortable-item-disabled')) return;

					e.preventDefault();

					// Store information about this pointer zone
					pointerZone = { id: zoneId, el: node, items: items };

					// The item index
					const index = items.indexOf(targetedItem);

					// Set the selected item
					selected.set({
						id: targetedItem.getAttribute('data-melt-sortable-item-id') ?? '0',
						originZone: zoneId,
						originIndex: index,
						originEl: node,
						zone: zoneId,
						zoneIndex: index,
						zoneEl: node,
						disabled: false, // Always false if we get here
						returnHome: targetedItem.hasAttribute('data-melt-sortable-item-return-home'),
						el: targetedItem,
					});

					// Create a ghost. This should be done before any data attributes are set
					// on the targeted item.
					const g = createGhostEl(targetedItem, e, props);
					ghost.set(g);

					// Set item dragging attribute
					targetedItem.setAttribute('data-melt-sortable-item-dragging', '');
					document.body.offsetHeight; // Force a reflow
					console.log('start dragging');
				}),
				addMeltEventListener(node, 'gotpointercapture', () => {
					console.log('zone got pointer capture');
				}),
				addMeltEventListener(node, 'touchstart', (e: TouchEvent) => {
					console.log('touchstart');
					e.preventDefault();
				}),
				// addMeltEventListener(node, 'touchend', (e: TouchEvent) => {
				// 	console.log('in here');
				// 	e.preventDefault();
				// }),
				addMeltEventListener(node, 'pointerenter', () => {
					console.log('ZONE ENTER');
					const zoneId = node.getAttribute('data-melt-sortable-zone-id');
					if (!zoneId) return;

					const props = zoneProps[zoneId];
					if (!zoneProps) return;

					// Do nothing when the zone is disabled
					if (props.disabled) return;

					// Do nothing when an item is not selected
					const $selected = get(selected);
					if (!$selected) {
						console.log('NO SELECTED');

						return;
					}

					// if(returningHome && )

					// Check if this zone supports dropping the item.
					if (!isSupportedZone($selected.originZone, zoneId, props.fromZones)) return;

					// Store information about this pointer zone
					pointerZone = {
						id: zoneId,
						el: node,
						items: Array.from(node.querySelectorAll(selector('item'))),
					};

					node.setAttribute('data-melt-sortable-zone-focus', '');
				}),
				addMeltEventListener(node, 'pointerleave', async () => {
					console.log('ZONE LEAVE');
					// When return home is true, return the item to its origin zone (when it is
					// not currently there)
					const $selected = get(selected);
					if (!$selected) return;

					if ($selected.returnHome && $selected.originZone !== $selected.zone) {
						// if ($selected.el.isAnimating) {
						// 	$selected.el.currentAnimation?.cancel();
						// }
						returnHome();
					}

					// Empty the pointer zone and zone change
					pointerZone = null;
					previousHitItem = null;

					node.removeAttribute('data-melt-sortable-zone-focus');
				})
			);
			return {
				destroy() {
					unsub();
				},
			};
		},
	});

	const item = builder(name('item'), {
		returned: () => {
			return (props: SortableItemProps) => {
				return {
					'data-melt-sortable-item-id': props.id,
					'data-melt-sortable-item-disabled': props.disabled ? true : undefined,
					'data-melt-sortable-item-return-home': props.returnHome ? true : undefined,
				};
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
		if (!$ghost || !isBrowser) return;

		const throttledMoveCheck = throttle((...args: unknown[]) => {
			const [ghost, e] = args as [SortableGhost, PointerEvent];
			return moveCheck(ghost, e);
		}, 50);

		// Define the event listeners
		const handlePointerMove = (e: PointerEvent) => {
			// Prevent default behavior while dragging
			// e.preventDefault();

			// Always update the ghost position.
			translate($ghost, e);

			throttledMoveCheck($ghost, e);
		};

		const handlePointerUp = () => {
			cleanup();
		};

		const cleanup = () => {
			// Remove the ghost
			$ghost.el.remove();
			ghost.set(null);

			// Clean up the pointer zone
			pointerZone?.el.removeAttribute('data-melt-sortable-zone-focus');
			pointerZone = null;

			previousHitItem = null;

			// Update selected item attributes and remove from store
			const $selected = get(selected);
			if ($selected) {
				$selected.el.removeAttribute('data-melt-sortable-item-dragging');
				selected.set(null);
			}

			// Cleanup even listeners
			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', handlePointerUp);
		};

		// Add event listeners
		document.addEventListener('pointermove', handlePointerMove, false);
		document.addEventListener('pointerup', handlePointerUp, false);
		document.addEventListener(
			'gotpointercapture',
			(e: PointerEvent) => {
				console.log('got pointer capture', Math.random());
				$ghost.el.releasePointerCapture(e.pointerId);
			},
			false
		);

		// Cleanup when the component is destroyed
		return () => {
			cleanup();
		};
	});

	/**
	 * Moves the selected item within a zone or to a new zone based on the hit item and quadrant.
	 *
	 * @param {SortableGhost} ghost - The ghost item being dragged.
	 * @param {PointerEvent} e - The pointer event.
	 */
	function moveCheck(ghost: SortableGhost, e: PointerEvent) {
		// Do nothing when outside a zone or in an unsupported zone.
		if (!pointerZone) return;

		// Get the selected item and zone props.
		const $selected = get(selected);
		const props = zoneProps[pointerZone.id];
		if (!$selected || !props) return;

		// True when the selected item is in the same zone as the pointer.
		const isSameZone = $selected.zone === pointerZone.id;

		// When this is an empty zone or it's a dropzone, add the selected item to the end.
		if (pointerZone.items.length === 0 || props.dropzone) {
			// Do nothing when the item has already been moved to this zone
			if (isSameZone) return;

			moveToEnd(e, props);
			return;
		}

		// We know this zone is not empty or a dropzone, so we can now check if the pointer is
		// NOT intersecting an item and return early or when the pointer and selected item are
		// in the same zone, check if the the pointer is intersecting the selected item and
		// return early.
		//
		// Only do this check when the selected item is not animating, as during an animation
		// items are moving around.
		const targetEl = e.target as HTMLElement;
		if (
			!$selected.el.isAnimating &&
			(!targetEl.closest('[data-melt-sortable-item]') ||
				(isSameZone && simpleIntersect($selected.el, ghost, e)))
		) {
			previousHitItem = null;
			return;
		}

		for (const [index, item] of pointerZone.items.entries()) {
			// skip the selected item.
			if ($selected.el === item) continue;

			// Ignore this item when it is the intersecting item  last intersected item when
			// it's animating.
			if (previousHitItem && previousHitItem.el.isAnimating && previousHitItem.el === item)
				continue;

			// Check for an intersect hit.
			const result = intersect(item, ghost, e, props, previousHitItem);

			if (result && result.hit && result.quadrant) {
				props.orientation !== 'both'
					? singleOrientationMove(index, result.quadrant, props.orientation)
					: multiOrientationMove(index, result.quadrant);

				// Set the previous hit item when it's not the same as the current hit item.
				if (!previousHitItem || previousHitItem.el !== item) {
					previousHitItem = {
						el: item,
						quadrant: result.quadrant,
						newZone: !isSameZone,
					};
				}

				return;
			}
		}
	}

	/**
	 * Moves an item within a zone or to a new zone. Use when the orientation is `vertical` or
	 * `horizontal`.
	 *
	 * @param {HTMLElement} item - The item the mouse is intersecting with.
	 * @param {Quadrant} quadrant - The quadrant the intersection took place in.
	 * @param {SortableOrientation} orientation - The orientation of the zone.
	 */
	function singleOrientationMove(
		hitItemIndex: number,
		quadrant: SortableQuadrant,
		orientation: SortableOrientation
	) {
		if (!pointerZone || orientation === 'both') return;

		// Get the selected item.
		const $selected = get(selected);
		if (!$selected) return;

		// Find the hit item.
		const hitItem = pointerZone.items[hitItemIndex];

		// Get the animation state for the involved zones.
		const animationState = getAnimationStateForZones(pointerZone, $selected);

		// if   - Move selected within zone and update pointer items array.
		// else - Move selected to new zone and update origin and pointer items array.
		if ($selected.zone === pointerZone.id) {
			const selectedIndex = pointerZone.items.indexOf($selected.el);

			pointerZone.items.splice(selectedIndex, 1);
			pointerZone.items.splice(hitItemIndex, 0, $selected.el as HTMLElement);
			moveEl($selected.el, hitItem, selectedIndex < hitItemIndex);
		} else {
			// Whether to insert the selected item before or after the intersected item
			let after = true;

			if (orientation === 'vertical') {
				if (quadrant.vertical === 'top') {
					hitItemIndex === 0
						? pointerZone.items.unshift($selected.el)
						: pointerZone.items.splice(hitItemIndex, 0, $selected.el);
					after = false;
				} else {
					hitItemIndex === pointerZone.items.length - 1
						? pointerZone.items.push($selected.el)
						: pointerZone.items.splice(hitItemIndex + 1, 0, $selected.el);
				}
			} else if (orientation === 'horizontal') {
				if (quadrant.horizontal === 'left') {
					hitItemIndex === 0
						? pointerZone.items.unshift($selected.el)
						: pointerZone.items.splice(hitItemIndex, 0, $selected.el);
					after = false;
				} else {
					hitItemIndex === pointerZone.items.length - 1
						? pointerZone.items.push($selected.el)
						: pointerZone.items.splice(hitItemIndex + 1, 0, $selected.el);
				}
			}

			$selected.zone = pointerZone.id;
			$selected.zoneEl = pointerZone.el;
			moveEl($selected.el, hitItem, after);
		}

		// Do the animation if we have state
		if (animationState) {
			animate(animationState, get(animationDuration), get(animationEasing));
		}
	}

	/**
	 * Moves an item within a zone or to a new zone. Use when the orientation is `both`.
	 *
	 * @param {number} hitItemIndex - The index of the hit item in the pointer zone.
	 * @param {SortableQuadrant} quadrant - The quadrant of the item.
	 */
	function multiOrientationMove(hitItemIndex: number, quadrant: SortableQuadrant) {
		if (!pointerZone) return;

		// Get the selected item.
		const $selected = get(selected);
		if (!$selected) return;

		// Find the hit item.
		const hitItem = pointerZone.items[hitItemIndex];

		// Get the animation state for the involved zones.
		const animationState = getAnimationStateForZones(pointerZone, $selected);

		// if   - Move selected within zone and update pointer items array.
		// else - Move selected to new zone and update origin and pointer items array.
		if ($selected.zone === pointerZone.id) {
			const selectedIndex = pointerZone.items.indexOf($selected.el);

			// There are 2 scenarios.
			//
			// 1. During a previous hit, the pointer ended up intersecting another item. This
			//    will set the `changedHitItem` flag to true. Additionally `flipMode` will be
			//    false. In this case we need to manually decide where to insert the selected
			//    item.
			// 2. When there is no previous hit item, or the hit item did not change following
			//    a previous hit, or the `flipMode` flag is true then the selected item will
			//    be either to the left or right of the hit item. In this case we can use
			//    simple logic to determine where to insert the selected item.
			if (previousHitItem && previousHitItem.changedHitItem && !previousHitItem.flipMode) {
				if (quadrant.horizontal === 'left') {
					// Move the selected item to before the hit item.
					if (hitItemIndex - 1 < 0 || hitItemIndex - 1 === selectedIndex) return;
					pointerZone.items.splice(selectedIndex, 1);
					pointerZone.items.splice(hitItemIndex - 1, 0, $selected.el as HTMLElement);
					moveEl($selected.el, hitItem, false);
				} else if (quadrant.horizontal === 'right') {
					// Move the selected item to after the hit item.
					if (hitItemIndex > pointerZone.items.length - 1 || hitItemIndex === selectedIndex) return;
					pointerZone.items.splice(selectedIndex, 1);
					pointerZone.items.splice(hitItemIndex, 0, $selected.el as HTMLElement);
					moveEl($selected.el, hitItem, true);
				}
			} else {
				pointerZone.items.splice(selectedIndex, 1);
				pointerZone.items.splice(hitItemIndex, 0, $selected.el as HTMLElement);
				moveEl($selected.el, hitItem, selectedIndex < hitItemIndex);
			}
		} else {
			// Whether to insert the selected item before or after the intersected item
			let after = true;

			if (quadrant.horizontal === 'left') {
				hitItemIndex === 0
					? pointerZone.items.unshift($selected.el)
					: pointerZone.items.splice(hitItemIndex, 0, $selected.el);
				after = false;
			} else {
				hitItemIndex === pointerZone.items.length - 1
					? pointerZone.items.push($selected.el)
					: pointerZone.items.splice(hitItemIndex + 1, 0, $selected.el);
			}

			$selected.zone = pointerZone.id;
			$selected.zoneEl = pointerZone.el;
			moveEl($selected.el, hitItem, after);
		}

		// Do the animation if we have state
		if (animationState) {
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

		const { hit } = intersect(pointerZone.el, $ghost, e, zoneProps, previousHitItem);

		if (!hit) return;

		// Get the animation state for the involved zones
		const animationState = getAnimationStateForZones(pointerZone, $selected);

		// Update the pointer zone to include the item
		$selected.zone = pointerZone.id;

		pointerZone.items.push($selected.el);
		pointerZone.el.appendChild($selected.el);

		// Do the animation if we have state
		if (animationState) {
			animate(animationState, get(animationDuration), get(animationEasing));
		}
	}

	/**
	 * Moves an item within a zone or to a new zone
	 *
	 * @param {HTMLElement} item - The item the mouse is intersecting with.
	 * @param {number} hitItemIndex - The new position for the item within the zone.
	 * @param {Quadrant} quadrant - The quadrant the intersection took place in.
	 * @param {SortableOrientation} orientation - The orientation of the zone.
	 */
	function returnHome() {
		if (!pointerZone) return;

		const $selected = get(selected);
		if (!$selected) return;

		// Get the origin zone
		const items: HTMLElement[] = Array.from($selected.originEl.querySelectorAll(selector('item')));

		// Get the animation state for the involved zones
		const itemsToAnimate = [...pointerZone.items, ...items];
		const animationState = getState(itemsToAnimate);

		returningHome = { el: $selected.zoneEl };

		if (items.length === 0) {
			$selected.originEl.appendChild($selected.el);
		}

		const item = items[$selected.originIndex];
		moveEl($selected.el, item, false);

		$selected.zone = $selected.originZone;
		$selected.zoneEl = $selected.originEl;

		// Do the animation if we have state
		if (animationState) {
			animate(animationState, get(animationDuration), get(animationEasing));
		}
	}

	/**
	 * Gets the current (FLIP) state for items in the pointer zone and items the the selected
	 * item resides in (if different).
	 *
	 * @returns {FlipState|null} - The current state of items in this zone, or null
	 */
	function getAnimationStateForZones(pointerZone: SortablePointerZone, selected: SortableSelected) {
		if (!selected) return null;

		const $animationDuration = get(animationDuration);
		if ($animationDuration <= 0) return null;

		const itemsToAnimate = [...(pointerZone.items as Element[])];
		if (selected.zone !== pointerZone.id) {
			itemsToAnimate.push(...Array.from(selected.zoneEl.querySelectorAll(selector('item'))));
		}

		return getState(itemsToAnimate);
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
