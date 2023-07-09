---
title: Dialog
description:
  A window overlaid on either the primary window or another dialog window, rendering the content
  underneath inert.
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data
</script>

## Anatomy

- **Trigger**: The button(s) that open the dialog
- **Overlay**: The dim background that is typically behind a dialog element.
- **Content**: Container for the content within the dialog.
- **Title**: The title of the dialog
- **Description**: The description which supports the title
- **Close**: The button(s) that close the dialog

## Usage

To create a dialog, use the `createDialog` builder function. You can then reference the anatomy or
example above to create your dialog.

## API Reference

<APITable data={data.builder} />

## Accessibility

Adheres to the [Dialog WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog/) &
[Alert Dialog WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)

<KbdTable data={data.keyboard} />
