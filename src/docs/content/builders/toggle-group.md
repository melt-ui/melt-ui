---
title: Toggle Group
description: A set of two-state buttons that can be toggled on or off.
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data
</script>

## Anatomy

- **Root**: The toggle group container component
- **Item**: A toggle group item component

## API Reference

<APITable data={data.builder} />
<APITable data={data.root} />
<APITable data={data.item} />

## Accessibility

Adheres to the [Button WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

<KbdTable data={data.keyboard} />
