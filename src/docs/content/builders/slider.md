---
title: Slider
description: An input where the user selects a value from within a given range
---

<script>
    import { APIReference, KbdTable } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Usage

To create a slider, use the `createSlider` builder function. Follow the anatomy or the example above
to create your slider.

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Slider WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)

<KbdTable {keyboard} />
