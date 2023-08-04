---
title: Radio Group
description:
  A set of checkable buttons — known as radio buttons — where no more than one of the buttons can be
  checked at a time.
---

<script>
    import { APIReference, KbdTable } from '$docs/components/index.js'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Root**: The root container for the radio group
- **Item**: The individual radio button items

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Radio Group WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)

<KbdTable {keyboard} />
