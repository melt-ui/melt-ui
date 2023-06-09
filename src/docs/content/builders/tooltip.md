---
title: Tooltip
description:
  A popup that displays information related to an element when the element receives keyboard focus
  or the mouse hovers over it.
---

<script>
    import { APIReference, KbdTable } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Trigger**: The element that triggers the tooltip popover
- **Content**: The tooltip's content container
- **Arrow**: An optional arrow component

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Tooltip WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)

<KbdTable {keyboard} />
