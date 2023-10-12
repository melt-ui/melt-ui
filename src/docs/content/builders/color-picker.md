---
title: Color Picker
description: A canvas element from which a color can be selected.
---

<script>
    import { KbdTable, APIReference, Preview } from '$docs/components';
    
    export let schemas;
    export let keyboard;
    export let snippets;
    export let previews;
</script>

## Anatomy

- **Color Canvas**: The canvas element that shows the colors.
- **Color Picker**: The canvas color picker element.
- **Hue Slider**: The canvas element for all the hue colors.
- **Hue Picker**: The hue picker element.
- **Alpha Slider**: The alpha slider element.
- **Alpha Picker**: The alpha picker element.
- **Hex Input**: The input element for the hex color value.

## Eye Dropper

We use the [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper) for the eye dropper builder store. This API is currently not supported by all browsers, so when using this feature you might want to hide the component depending on the user's browser.

## Orientation

<Preview code={snippets.orientation}>
    <svelte:component this={previews.orientation} />
</Preview>

## Helper functions

We export some helper functions to convert colors between different formats. This also allows you to convert the derived RGB, HSL, and HSV formats back to hex format to apply to the `$value` store.

```svelte
<script lang="ts">
    import {
        RGBtoHex,
        hextoRGB,
        HSLtoHex,
        hexToHSL,
        HSVtoHex,
        hexToHSV
    } from '@melt-ui/svelte/internal/helpers';
</script>
```

## API Reference

<APIReference {schemas} />

## Accessibility

<KbdTable {keyboard} />
