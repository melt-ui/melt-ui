---
title: Select
description: Presents a selection of choices to the user, activated by a button.
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data
</script>

## Anatomy

- **Trigger**: The button that opens/closes the select menu
- **Menu**: The popover select menu
- **Option**: The individual select options
- **Arrow**: An optional arrow component

## API Reference

<APITable data={data.builder} />
<APITable data={data.trigger} />
<APITable data={data.option} />
<APITable data={data.arrow} />
<APITable data={data.group} />
<APITable data={data.groupLabel} />
<APITable data={data.separator} />

## Accessibility

Adheres to the [ListBox WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)

<KbdTable data={data.keyboard} />
