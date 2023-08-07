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

## Understanding threshold

`threshold` is a zonal prop that is used when determining how far the pointer must intersect an item, within the given zone, before a __hit__ is considered. This value ranges from `0` to `1` and defaults to `0.95`.

- When the threshold is `1`, a __hit__ is considered when the pointer intersects any part of an item. 
- When the threshold is `0`, an intersection will never occur.

The threshold is calculated from the middle out. The direction of the threshold depends on the `orientation` of the zone. When the orientation is `horizontal`, the horizontal (left/right) plane is used. When the orientation is `vertical`, the vertical (top/bottom) plane is used. When the orientation is `both`, the both the horizontal and vertical planes are used.

For example, say the orientation is `horizontal` and the threshold is `0.5`. This would mean that 25% of the left side and right side will not be considered a __hit__.

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