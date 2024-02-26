---
title: Tree View
description:
  A hierarchical list of nested items, where each item can have additional children elements.
---

<script>
    import { KbdTable, APIReference, Preview } from '$docs/components'
    export let schemas;
    export let keyboard;
</script>

## Anatomy

- **Tree**: The container in which the tree lies.
- **Item**: The individual tree item element.
- **Group**: An element where a subtree is nested.

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Tree View WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)

<KbdTable {keyboard} />
