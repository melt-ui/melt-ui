---
title: Collapsible
description: An interactive component which expands/collapses a panel.
---

<script>
    import { KbdTable, APIReference, Preview } from '$docs/components'
    export let keyboard
    export let schemas
    export let previews
    export let snippets
</script>

## Anatomy

- **Root**: The root container for the collapsible
- **Trigger**: The element that triggers the collapsible to expand/collapse
- **Content**: The element that is revealed when the collapsible is expanded

## Example Components

### Controlled (BYOS)

<Preview code={snippets.controlled}>
    <svelte:component this={previews.controlled} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Disclosure WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)

<KbdTable {keyboard} />
