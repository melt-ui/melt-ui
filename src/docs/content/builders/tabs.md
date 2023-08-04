---
title: Tabs
description:
  A set of layered sections of content—known as tab panels—that are displayed one at a time.
---

<script>
    import { APIReference, KbdTable } from '$docs/components/index.js'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Root**: The root container for the tab component
- **List**: The container for the tab triggers
- **Trigger**: The button(s) that open/close the tab panels
- **Content**: The container for the tab panels

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Tabs WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/)

<KbdTable {keyboard} />
