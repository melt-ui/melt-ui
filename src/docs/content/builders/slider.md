---
title: Slider
description: An input where the user selects a value from within a given range
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
    export let snippets
    export let previews
</script>

## Usage

To create a slider, use the `createSlider` builder function. Follow the anatomy or the example above
to create your slider.

## Example Components

### Range slider

Since the slider `value` prop accepts an array, you can create a range slider by passing in an array
with multiple values, and use multiple thumbs to display the range. Here's an example of a range
slider with two thumbs:

<Preview code={snippets.range}>
    <svelte:component this={previews.range} />
</Preview>

### Vertical slider

By setting the `orientation` prop to `vertical`, you can create a vertical slider. Here's an
example:

<Preview code={snippets.vertical}>
    <svelte:component this={previews.vertical} />
</Preview>

### RTL

To enable Right-to-Left (RTL) support, you can set the `rtl` prop to `true. Here's an example of a
horizontal slider with RTL enabled:

<Preview code={snippets.rtl_horizontal}>
    <svelte:component this={previews.rtl_horizontal} />
</Preview>

In a Right-to-Left (RTL) context, vertical sliders function from top-to-bottom instead of bottom-to
top. Here's an example of a vertical slider with RTL enabled:

<Preview code={snippets.rtl_vertical}>
    <svelte:component this={previews.rtl_vertical} />
</Preview>

### Slider ticks

You can add slider ticks using the `ticks` state and the `tick` element returned by `createSlider`.

<Preview code={snippets.ticks}>
    <svelte:component this={previews.ticks} />
</Preview>

### Disable Index Swapping

By default, the `value` array is always automatically sorted. You can disable this behavior by setting `disableSwap` to `true`, which will keep values in their original spot when thumbs are moved past each other.

<Preview code={snippets.multiple}>
    <svelte:component this={previews.multiple} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Slider WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)

<KbdTable {keyboard} />
