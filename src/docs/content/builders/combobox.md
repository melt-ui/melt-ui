---
title: Combobox
description:
  An input with an associated popup containing a list of options. Commonly used for autocomplete
  functionality and command palettes.
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
  - **Arrow**: An optional arrow element which points to the menu's input

## Examples

### Debounce

Sometimes you may want to [debounce](https://www.freecodecamp.org/news/javascript-debounce-example/)
user input in the `input` element. This pattern can be useful to prevent over-requesting data from a
server, for example.

<Preview code={snippets.debounce}> 
  <svelte:component this={previews.debounce} /> 
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Autocomplete/Combobox WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

<KbdTable {keyboard} />
