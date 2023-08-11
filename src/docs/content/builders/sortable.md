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

## Orientation and Threshold

`Orientation` and `threshold` are a zonal props, which are used when determining if a _hit_ has occurred between the pointer and another item.

`Orientation` is a required prop that defines the direction the items flow in. This value can be `horizontal`, `vertical`, or `both`, for grid like layouts.

`threshold`, is an optional prop and is used in combination with orientation to determine how far the pointer must intersect an item before it is considered a _hit_. This value ranges from `0` to `1` and defaults to `0.95`.

- When the threshold is `1`, any intersection will result in a hit. 
- When the threshold is `0`, a hit can never occur.

Threshold is calculated from the middle out using the orientation.

- When the orientation is `horizontal`, the threshold will expand on the horizontal (left/right) axis. 
- When the orientation is `vertical`, the threshold will expand on the vertical (top/bottom) axis. 
- When the orientation is `both`, the threshold will expand on both axis.

For example, when the orientation is `horizontal` and the threshold is `0.5`, 25% of the left and right sides will not trigger a _hit_.

In the following example, the darker areas show where a __hit__ will occur.

<Preview code={snippets.threshold}>
    <svelte:component this={previews.threshold} />
</Preview>

## Animation

Sortable handles the animation of items internally as they are moved, via a custom implementation of FLIP (First, Last, Invert, Play).

`createSortable` accepts 2 optional props for controlling this behavior; `animationDuration` and `animationEasing`.

`animationDuration` is the duration of the animation in milliseconds. This defaults to `150`.

`animationEasing` is the easing function used for the animation. This defaults to `ease-out`.

In the following example, the duration can be set to between 0 and 5 seconds. 

<Preview code={snippets.animation}>
    <svelte:component this={previews.animation} />
</Preview>

## Example Components

### Dropzone

`dropzone` is an optional zonal prop, that gives a zone the following characteristics:

- Items in a dropzone cannot be sorted.
- Items in a dropzone cannot be moved to other zones.
- Items from other zones can be moved into a dropzone, if the dropzone support the `fromZone`.
- Items moved into a dropzone are placed at the end.

<Preview code={snippets.dropzone}>
    <svelte:component this={previews.dropzone} />
</Preview>