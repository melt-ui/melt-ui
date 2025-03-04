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
  - **Option**: The individual combobox items
  - **Label**: The label for the input
  - **Arrow**: An optional arrow element which points to the menu's input
  - **Group**: Optional group and group label elements which can be used to group options

## Examples

### Multiple

We expose a `multiple` prop to allow for multiple selections.

<Preview code={snippets.multi}>
  <svelte:component this={previews.multi} />
</Preview>

### Debounce

Sometimes you may want to [debounce](https://www.freecodecamp.org/news/javascript-debounce-example/)
user input in the `input` element. This pattern can be useful to prevent over-requesting data from a
server, for example.

<Preview code={snippets.debounce}>
  <svelte:component this={previews.debounce} />
</Preview>

### Group

The `group` and `groupLabel` elements can be used to group combobox list items.

<Preview code={snippets.group}>
  <svelte:component this={previews.group} />
</Preview>

### Shadow DOM

By default, the comboBox uses the `document` as the root element to query its internal components.
By utilizing the `rootElement` property you can override this behaviour, this is especially useful
when running inside the Shadow DOM.

<Preview code={snippets.shadow} position="static">
    <svelte:component this={previews.shadow} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Autocomplete/Combobox WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

<KbdTable {keyboard} />
