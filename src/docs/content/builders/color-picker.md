---
title: Color Picker
description: A canvas element from which a color can be selected.
---

<script>
    import { KbdTable, APIReference, Preview } from '$docs/components'
    export let schemas;
    export let keyboard;
</script>

## Anatomy

- **Canvas**: The canvas element that shows the colors.
- **Picker**: The canvas color picker element.

## Eye Dropper

We use the [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper) for the eye dropper builder store. This API is currently not supported by all browsers, so when using this feature you might want to hide the component depending on the user's browser.

## API Reference

<APIReference {schemas} />

## Accessibility

<KbdTable {keyboard} />
