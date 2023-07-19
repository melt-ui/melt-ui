---
title: Toast
description: A succinct message that is displayed temporarily.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Content**: Container for the content within the toast
- **Title**: The title of the toast
- **Description**: The description which supports the title
- **Close**: The button(s) that close the toast

## Usage

To create a toast, use the `createToast` builder function. You can then reference the anatomy or
example above to create your toast.

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Alert WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)

<KbdTable {keyboard} />
