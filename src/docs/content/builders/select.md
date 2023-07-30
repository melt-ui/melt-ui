---
title: Select
description: Presents a selection of choices to the user, activated by a button.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
    export let snippets
    export let previews
</script>

## Anatomy

- **Trigger**: The button that opens/closes the select menu
- **Menu**: The popover select menu
- **Option**: The individual select options
- **Arrow**: An optional arrow component

## Usage

To create an select, use the `createSelect` builder function. Follow the anatomy or the example at
the top of this page to create your select.

## Example components

### Multi-select

A multi-select is a select that allows the user to select multiple options. To create a
multi-select, simply set the `multiple` prop to `true` on the `createSelect` builder.

<Preview code={snippets.multi}>
    <svelte:component this={previews.multi} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [ListBox WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)

<KbdTable {keyboard} />
