---
title: Collapsible
description: An interactive component which expands/collapses a panel.
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data
</script>

## Anatomy

- **Root**: The root container for the collapsible
- **Trigger**: The element that triggers the collapsible to expand/collapse
- **Content**: The element that is revealed when the collapsible is expanded

## API Reference

<APITable data={data.builder} />
<APITable data={data.root} />
<APITable data={data.content} />

## Accessibility

Adheres to the
[Disclosure WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)

<KbdTable data={data.keyboard} />
