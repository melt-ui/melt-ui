---
title: Radio Group
description:
  A set of checkable buttons — known as radio buttons — where no more than one of the buttons can be
  checked at a time.
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data
</script>

## Anatomy

- **Root**: The root container for the radio group
- **Item**: The individual radio button items

## API Reference

<APITable data={data.builder} />
<APITable data={data.root} />
<APITable data={data.item} />
<APITable data={data.itemInput} />

## Accessibility

Adheres to the
[Radio Group WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)

<KbdTable data={data.keyboard} />
