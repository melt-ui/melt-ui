---
title: Tabs
description:
  A set of layered sections of content—known as tab panels—that are displayed one at a time.
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data
</script>

## Anatomy

- **Root**: The root container for the tab component
- **List**: The container for the tab triggers
- **Trigger**: The button(s) that open/close the tab panels
- **Content**: The container for the tab panels

## API Reference

<APITable data={data.builder} />
<APITable data={data.root} />
<APITable data={data.list} />
<APITable data={data.trigger} />
<APITable data={data.content} />

## Accessibility

Adheres to the [Tabs WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/)

<KbdTable data={data.keyboard} />
