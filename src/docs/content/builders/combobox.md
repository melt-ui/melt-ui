---
title: Combobox
description: A filterable list of items that supports selection.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
    export let snippets
    export let previews
</script>

## Anatomy

- **Input**: The input that opens, closes, filters the list, and displays the selected value from
  the list
- **Menu**: The popover menu
- **Item**: The individual list item
- **Label**: The label for the input

## Examples

### Debounce

It may be useful to debounce user input in the `input` element.

<Preview code={snippets.debounce}>
  <svelte:component this={previews.debounce} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Autocomplete/Combobox WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

<KbdTable {keyboard} />
