---
title: Tooltip
description:
  A popup that displays information related to an element when the element receives keyboard focus
  or the mouse hovers over it.
---

<script>
    import { APIReference, KbdTable, Callout } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Trigger**: The element that triggers the tooltip popover
- **Content**: The tooltip's content container
- **Arrow**: An optional arrow component

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[WAI-ARIA tooltip role design pattern](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role)

<Callout type="warning">

Tooltips are only opened on hover/focus and not on press, as the tooltip content is used to describe
the element that would be activated by the press, such as an trashcan icon button which would delete
something. If the button is pressed, an action should be taken, which in that case it is too late to
display a tooltip.

Chances are if you have a need to display the tooltip on press, using a tooltip isn't
accessible/appropriate, and should instead consider using a [Popover](/docs/builders/popover).

</Callout>

<KbdTable {keyboard} />
