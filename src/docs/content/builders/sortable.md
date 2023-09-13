---
title: Sortable
description: Sort items within a zone or move items between zones.
---

<script>
    import { APIReference, Preview, Callout } from '$docs/components'
    export let snippets
    export let previews
    export let schemas
</script>

## Anatomy

- **Zone**: A zone container
- **Item Group**: An item group container within a zone
- **Item**: An item container within a zone or items container
- **Handle**: A handle that can be used to move an item

## Usage

To create a sortable zones containing items, use the `createSortable` builder function.

```svelte {3-5}
<script lang="ts">
	import { createSortable } from '@melt-ui/svelte'
	const {
		elements: { zone, itemGroup, item, handle }
	} = createSortable()
</script>
```

These elements can then be used to construct 1 or more sortable zones that contain items.

A high level example of how to structure a single sortable zone, with 2 items, is shown below.

<Callout type='warning'>

⚠️ It is important to place a <code>min-height</code> on <code>$zone</code> elements, otherwise they
will collapse when they become empty and a pointer intersection will never occur, unless that is the
intended behavior.

</Callout>

```svelte
<script lang="ts">
	import { createSortable } from '@melt-ui/svelte'
	const {
		elements: { zone, item }
	} = createSortable()
</script>

<div use:melt={$zone({ id: 'zone1' })}>
	<div use:melt={$item({ id: 'item1' })}>item 1</div>
	<div use:melt={$item({ id: 'item2' })}>item 2</div>
</div>
```

In the above example, a `zone` is created with the unique id of `zone1`. By default this zone will
have an orientation of vertical and a hit threshold of 0.95.

This zone contains 2 items that are uniquely identified as `item1` and `item2` that can be dragged
and intersect/swap with each other.

### Item Group

An `itemGroup` element can be used as a target location for items to be placed together, within a
zone.

When a zone contains no `$item` elements, the first item dragged into this zone will be added as a
child. This may not be the desired behavior, and instead you wish to have a target location for
items to be placed.

Multiple item groups can be used within the same zone.

<Callout type='warning'>

⚠️ It is important to place a <code>min-height</code> on <code>$itemGroup</code> elements, otherwise
they will collapse when they become empty and a pointer intersection will never occur, unless that
is the intended behavior.

</Callout>

```svelte {2}
<div use:melt={$zone({ id: 'zone1' })}>
	<div use:melt={$itemGroup}>
		<div use:melt={$item({ id: 'item1' })}>item 1</div>
	</div>
</div>
```

### Item Handle

To specify a handle, add a `handle` element within an `item`.

```svelte {2}
<div use:melt={$item({ id: 'item1' })}>
	<div use:melt={$handle}>...</div>
	<span>item 1</span>
</div>
```

### Multiple Zones (fromZones prop)

By default items cannot move between zones. To allow items to move from one zone to another, use the
zonal prop `fromZone`.

`fromZone` supports `*` to allow items from all zones, `-` to disallow items from all zones or
`string[]`` to allow items from specific zones.

The following shows a high level example of 2 zones; `zone1` and `zone2`. `zone1` is configured to
allow items from `zone2`, while `zone2`, by default, will disallow items from all other zones.

```svelte {1}
<div use:melt={$zone({ id: 'zone1', fromZone: ['zone2'] })}>...</div>
<div use:melt={$zone({ id: 'zone2' })}>...</div>
```

### Ghost

When an item is selected, a ghost element is created. This ghost element is a deep clone of the
selected item.

All `data-melt-*` and `data-sortable-*` attributes are removed and then the element is given the
`data-melt-sortable-ghost` data attribute.

This attribute can be use on with any `$item` elements to style the element when it selected and
cloned into a ghost element. You could, for example, reduce the opacity, set a border, hide child
elements, etc.

<!-- prettier-ignore -->
```svelte {2}
<div 
	class="data-[melt-sortable-ghost]:opacity-50 ..." 
	use:melt={$item({ id: 'item1' })}>
	item 1
</div>
```

### Nesting

Nesting is supported. To enable nesting, set the zonal prop `nesting` to true.

When `nesting` is `true`, items can be places within other items.

```svelte {2}
<div use:melt={$zone({ id: 'zone 1', nesting: true })}>
	<!-- Item 1 -->
	<div use:melt={$item({ id: 'item 1' })}>
		<span>Item 1</span>

		<!--Item 1.1 -->
		<div use:melt={$item({ id: 'item 1.1' })}>
			<span>Item 1.1</span>
		</div>
	</div>
</div>
```

## Orientation and Threshold

`Orientation` and `threshold` are a zonal props, which are used when determining if a _hit_ has
occurred between the pointer and another item.

`Orientation` is an optional prop that defines the direction the items flow in. This value can be
`horizontal`, `vertical`, or `both`, for grid like layouts. It defaults to `vertical`.

`threshold`, is an optional prop and is used in combination with orientation to determine how far
the pointer must intersect an item before it is considered a _hit_. This value ranges from `0` to
`1` and defaults to `0.95`.

- When the threshold is `1`, any intersection will result in a hit.
- When the threshold is `0`, a hit can never occur.

Threshold is calculated from the middle out using the orientation.

- When the orientation is `horizontal`, the threshold will expand on the horizontal (left/right)
  axis.
- When the orientation is `vertical`, the threshold will expand on the vertical (top/bottom) axis.
- When the orientation is `both`, the threshold will expand on both axis.

For example, when the orientation is `horizontal` and the threshold is `0.5`, 25% of the left and
right sides will not trigger a _hit_.

In the following example, the darker areas show where a **hit** will occur.

<Preview code={snippets.threshold}>
    <svelte:component this={previews.threshold} />
</Preview>

## Animation

Sortable handles the animation of items internally as they are moved, via a custom implementation of
FLIP (First, Last, Invert, Play).

An `animationDuration` can be passed in to the builder to set the duration (default: 150ms), while
`animationEasing` can be passed in to set the easing function (default: ease-out).

<Preview code={snippets.animation}>
    <svelte:component this={previews.animation} />
</Preview>

## Example Components

### Dropzone

`dropzone` is an optional zonal prop, that gives a zone the following characteristics:

- Items in a dropzone **cannot** be selected and dragged internally or to other zones.
- Items from other zones **can** be moved into a dropzone, if item is allowed by `fromZone`, and
  will be placed at the end.

<Preview code={snippets.dropzone}>
    <svelte:component this={previews.dropzone} />
</Preview>

### Item Groups

The following example shows how to use `$itemGroup` to separate items into different groups, within
the same zone.

Items can be moved between groups.

<Preview code={snippets.itemGroups}>
    <svelte:component this={previews.itemGroups} />
</Preview>

### Nesting

<Preview code={snippets.nesting}>
    <svelte:component this={previews.nesting} />
</Preview>

## API Reference

<APIReference {schemas} />
