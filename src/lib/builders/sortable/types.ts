import type { AnimationElement } from '$lib/internal/helpers/flip';
import type { BuilderReturn } from '$lib/internal/types';
import type { createSortable } from './create';

export type CreateSortableProps = {
	/**
	 * The length of time in ms to animate the item to its new position.
	 *
	 * @default 150
	 */
	animationDuration?: number;

	/**
	 * The easing function to use for the animation.
	 *
	 * @default ease-out
	 */
	animationEasing?: string;
};

export type SortableZoneProps = {
	/**
	 *  A unique id for the zone.
	 *
	 *  Sets `data-melt-zone-id=[id]`.
	 */
	id: string;

	/**
	 * The orientation of the items within this zone. This impacts where the threshold is applied.
	 *
	 * When `horizontal`, the threshold takes effect on the left and right of the item.
	 * When `vertical`, the threshold takes effect on the top and bottom of the item.
	 * When `both`, the threshold takes effect on all four sides of the item.
	 *
	 * See `threshold` in `SortableZoneProps`
	 */
	orientation: SortableOrientation;

	/**
	 * Disables all items in the zone. Items within this zone cannot be moved, nor can items be
	 * moved into this zone.
	 *
	 * Sets `data-melt-zone-disabled=''` when true.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * The threshold is used when determining if the pointer is intersecting with an item. It is
	 * a value between 0 and 1, where 1 indicates the entire item.
	 *
	 * The threshold is applied from the center out. For example at 0.5, only the middle 50% of
	 * the item is intersectable and the pointer can be inside the item by 25% without triggering
	 * an intersect.
	 *
	 * When orientation is vertical, the threshold takes effect on the top and bottom of the item.
	 * When orientation is horizontal, the threshold takes effect on the left and right of the item.
	 * When orientation is both, the threshold takes effect on all four sides of the item.
	 *
	 * See `orientation` in `SortableZoneProps`
	 *
	 * @default 0.95
	 */
	threshold?: number;

	/**
	 * when true, this zone is considered a dropzone. Items within a dropzone cannot be selected.
	 * Items from other zones may be dragged into this zone and will be placed at the end.
	 *
	 * Sets `data-melt-zone-dropzone=''` when true.
	 *
	 * @default false
	 */
	dropzone?: boolean;

	/**
	 * A list of zones whose items will be accepted in this zone.
	 *
	 * When '*', items from all zones are accepted.
	 * When '-', items from other zones are not accepted.
	 * When a list of zone ids, items from those zones are accepted.
	 *
	 * @default '-'
	 */
	fromZones?: '*' | '-' | string[];

	/**
	 * The axis items in this zone can be dragged on.
	 *
	 * When `x`, items can only be dragged horizontally.
	 * When `y`, items can only be dragged vertically.
	 * When `both`, items can be dragged in any direction.
	 *
	 * @default both
	 */
	axis?: SortableAxis;

	/**
	 * The bounds items in this zone are restricted to.
	 *
	 * When `none`, items can be dragged anywhere on the page.
	 * When `body`, items can be dragged anywhere within the body.
	 * When a query selector, items can be dragged anywhere within the element matching the selector.
	 *
	 * @default body
	 */
	restrictTo?: SortableBounds;
};

export type SortableItemProps = {
	/**
	 * A unique id for the item.
	 *
	 * Sets `data-melt-item-id=[id]`.
	 */
	id: string;

	/**
	 * Whether the item is disabled. Disabled items cannot be dragged but may shift position
	 * when other items are dragged.
	 *
	 * Sets `data-melt-item-disabled=''` when true.
	 *
	 * @default false
	 */
	disabled?: boolean;
};

export type SelectedItem = {
	/**
	 * The item element
	 */
	el: HTMLElement;

	/**
	 * The zone this item current belongs to at the time of the pointerdown event. As the item
	 * is dragged between zones, this value will change.
	 */
	zone: string;

	/**
	 * This is the origin zone of the item as the time of the pointerdown event. This value
	 * will not change as the item is dragged between zones.
	 */
	originZone: string;

	/**
	 * A reference to the zone element that this item currently belongs to. As the item is dragged
	 * between zones, this value will change.
	 */
	zoneEl: HTMLElement;
} & Required<SortableItemProps>;

export type SortableGhost = {
	/**
	 * The ghost element.
	 */
	el: HTMLElement;

	/**
	 * The bounds of the ghost element. This is updated as the ghost moves around.
	 */
	bounds: DOMRect | null;

	/**
	 * The bounds that the ghost is restriced to. The ghost element will not be able to
	 * move outside of these bounds.
	 *
	 * See `restrictTo` in `SortableZoneProps`
	 *
	 * @default null
	 */
	restrictedBounds: DOMRect | null;

	/**
	 * The axis the ghost is restricted to.
	 *
	 * See `axis` in `SortableZoneProps`
	 */
	canMoveInX: boolean;
	canMoveInY: boolean;

	/**
	 * The initial x/y position of the ghost element when it was created. This is used to
	 * calculate the offset so the ghost can be positioned under the pointer.
	 */
	initialX: number;
	initialY: number;

	/**
	 * This is the client to node offset. It is set when the ghost is element is created and is
	 * used when calculating the virtual client bounds.
	 */
	clientToNodeOffsetX: number;
	clientToNodeOffsetY: number;
};

export type SortablePointerZone = {
	id: string;
	el: HTMLElement;
	items: AnimationElement[];
};

// The axis of a sortable item
export type SortableAxis = 'x' | 'y' | 'both';

// The bounds of a sortable item
export type SortableBounds = 'none' | 'body' | string;

// The orientation of a sortable item
export type SortableOrientation = 'horizontal' | 'vertical' | 'both';

// The quadrants a pointer can be in
export type SortableQuadrant = {
	horizontal: 'left' | 'right';
	vertical: 'top' | 'bottom';
};

export type Sortable = BuilderReturn<typeof createSortable>;
export type SortableElements = Sortable['elements'];
export type SortabletOptions = Sortable['options'];
