---
title: Combobox
description: A filterable list of items that supports selection.
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data
</script>

## Anatomy

- **Input**: The input that opens, closes, filters the list, and displays the selected value from
  the list
- **Menu**: The popover menu
- **Item**: The individual list item

## API Reference

<APITable data={data.builder} />
<APITable data={data.item} />
<APITable data={data.input} />
<APITable data={data.arrow} />

## Accessibility

Adheres to the
[Autocomplete/Combobox WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
<KbdTable data={data.keyboard} />
