---
title: Tree View
description:
  A hierarchical list of nested items, where each item can have additional children elements.
---

<script>
    import { KbdTable, APIReference, Preview } from '$docs/components'
    export let schemas;
    export let keyboard;
    export let previews;
    export let snippets;
</script>

## Anatomy

- **Tree**: The container in which the tree lies.
- **Label**: The element that describes the tree.
- **Item**: The individual tree item element.
- **Group**: An element where a subtree is nested.

## Usage

To enable multi select, pass `multiple: true` to the tree builder.

<Preview code={snippets.multiple}>
    <svelte:component this={previews.multiple} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Tree View WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)

<KbdTable {keyboard} />
