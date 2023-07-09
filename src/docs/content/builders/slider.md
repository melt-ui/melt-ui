---
title: Slider
description: An input where the user selects a value from within a given range
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data;
</script>

## Usage

To create a slider, use the `createSlider` builder function. Follow the anatomy or the example above
to create your slider.

## API Reference

<APITable data={data.builder} />
<APITable data={data.slider} />
<APITable data={data.thumb} />

## Accessibility

Adheres to the [Slider WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)

<KbdTable data={data.keyboard} />
