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

You can set the `orientation` prop to `horizontal-rl` for right-to-left orientation. Here's an
example:

<Preview code={snippets.horizontal_rl}>
    <svelte:component this={previews.horizontal_rl} />
</Preview>

Top-to-bottom orientation is also supported by setting `orientation` to `vertical-tb`. Here's an
example:

<Preview code={snippets.vertical_tb}>
    <svelte:component this={previews.vertical_tb} />
</Preview>

### Slider ticks

You can add slider ticks using the `ticks` state and the `tick` element returned by `createSlider`.

<Preview code={snippets.ticks}>
    <svelte:component this={previews.ticks} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Slider WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)

<KbdTable {keyboard} />
