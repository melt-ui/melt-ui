---
title: Toolbar
description:
  A container for grouping a set of controls, such as buttons, toggle groups or dropdown menus.
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data
</script>

## API Reference

<APITable data={data.builder} />
<APITable data={data.toolbar} />
<APITable data={data.button} />
<APITable data={data.link} />
<APITable data={data.separator} />
<APITable data={data.groupBuilder} />
<APITable data={data.group} />
<APITable data={data.groupItem} />

## Accessibility

Adheres to the [Toolbar WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

<KbdTable data={data.keyboard} />
