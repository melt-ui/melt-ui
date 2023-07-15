---
title: Select
description: Presents a selection of choices to the user, activated by a button.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
    export let previews
    export let snippets
</script>

<Preview code={snippets.multiple}>
    <svelte:component this={previews.multiple} />
</Preview>

## Anatomy

- **Trigger**: The button that opens/closes the select menu
- **Menu**: The popover select menu
- **Option**: The individual select options
- **Arrow**: An optional arrow component

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [ListBox WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)

<KbdTable {keyboard} />
