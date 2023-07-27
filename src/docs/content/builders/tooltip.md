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

Tooltips are only activated on hover or on focus, and not on press. Since the tooltip is generally
used to describe an action, its usefulness would be limited in case it appeared on press, seeing as
the action would have already been performed. This behaviour is also predicted by the WAI-ARIA
tooltip role design pattern.

Chances are if you have a need to display content on press, using a tooltip isn't
accessible/appropriate, and should instead consider using a [Popover](/docs/builders/popover).

</Callout>

<KbdTable {keyboard} />
