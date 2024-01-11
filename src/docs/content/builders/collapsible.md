---
title: Collapsible
description: An interactive component which expands/collapses a panel.
---

<script>
    import { KbdTable, APIReference, Preview } from '$docs/components'
    export let keyboard
    export let schemas
    export let snippets
    export let previews
</script>

## Anatomy

- **Root**: The root container for the collapsible
- **Trigger**: The element that triggers the collapsible to expand/collapse
- **Content**: The element that is revealed when the collapsible is expanded

## Componentization

If you want to create a `Collapsible` component with reactive props, you can use our sync utilities.

<Preview code={snippets.sync}>
    <svelte:component this={previews.sync} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Disclosure WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)

<KbdTable {keyboard} />
