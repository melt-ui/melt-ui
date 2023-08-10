---
title: Sortable
description:
  Sort items.
---

<script>
    import { Preview } from '$docs/components'
    export let snippets
    export let previews
</script>


<Preview code={snippets.grid}>
    <svelte:component this={previews.grid} />
</Preview>

## Orientation and Threshold

`Orientation` and `threshold` are a zonal props, which are used when determining if intersection (hit) has occurred between the pointer and an item as well as how the items are sorted within the zone.

`Orientation` is a required prop that defines the direction the items flow in. This value can be `horizontal`, `vertical`, or `both`.

`threshold`, in combination with orientation, is used when determining how far the pointer must intersect an item before a __hit__ is considered. This value ranges from `0` to `1` and defaults to `0.95`.

  - When the threshold is `1`, a __hit__ is considered when the pointer intersects any part of an item. 
  - When the threshold is `0`, an intersection will never occur.

The threshold is calculated from the middle out. 

- When the orientation is `horizontal`, the threshold will expand on the horizontal (left/right) plane. 
- When the orientation is `vertical`, the threshold will expand on the vertical (top/bottom) plane. 
- When the orientation is `both`, the threshold will expand in all directions.

For example, if the orientation is `horizontal` and the threshold is `0.5`, 25% of the left and right sides would NOT trigger a __hit__.

In the following example, the darker areas show where a __hit__ will occur.

<Preview code={snippets.threshold}>
    <svelte:component this={previews.threshold} />
</Preview>

## Example Components

### Dropzone

A zone can be defined as a dropzone by setting the `dropzone` prop to `true`. Items in a dropzone cannot be sorted, nor can they be moved to other zones.

Items can be placed in a dropzone, if the dropzone supports it in `fromZones`.

<Preview code={snippets.dropzone}>
    <svelte:component this={previews.dropzone} />
</Preview>