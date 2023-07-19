---
title: Hover Card
description: Enable sighted users to preview content behind a link.
---

<script>
    import { KbdTable, APIReference, Callout } from '$docs/components'
    export let schemas
</script>

<Callout type="warning">

⚠️ The Hover Card is only intended to be used with a mouse or other pointing device and doesn't
respond to keyboard or touch events. On touch devices, the link will be followed immediately.

</Callout>

## Anatomy

- **Trigger**: The element that opens the hovercard on hover.
- **Content**: The element containing the content for the hovercard.
- **Arrow**: An optional arrow component

## Usage

Create a hovercard using the `createHoverCard` builder function.

```svelte {3}
<script lang="ts">
  import { createHoverCard } from '@melt-ui/svelte'
  const { trigger, content, open, arrow } = createHoverCard()
</script>
```

Then you can use the `trigger`, `content`, and `arrow` to construct a hovercard. A high level
example of how to structure the hovercard is shown below.

```svelte
<script lang="ts">
  import { createHoverCard } from '@melt-ui/svelte'
  const { trigger, content, arrow } = createHoverCard()
</script>

<button melt={$trigger}>Hover Me</button>

<div melt={$content}>
  <div>I am content inside the hover card</div>
  <div melt={$arrow} />
</div>
```

It's also possible to use Svelte Transitions, as demonstrated in the example at the top of this
page.

## API Reference

<APIReference {schemas} />

## Accessibility

The hover card is only intended to be used with a mouse or other pointing device and doesn't respond
to keyboard events.
