---
title: Hover Card
description:
  Displays additional information or options when the cursor hovers over a particular element.
---

<script>
    import { KbdTable, APIReference } from '$docs/components'
    export let schemas
</script>

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

<button {...$trigger} use:trigger>Hover Me</button>

<div {...$content} use:content>
  <div>I am content inside the hover card</div>
  <div {...$arrow} />
</div>
```

It's also possible to use Svelte Transitions, as demonstrated in the example at the top of this
page.

## API Reference

<APIReference {schemas} />

## Accessibility

The hover card is only intended to be used with a mouse or other pointing device and doesn't respond
to keyboard events.
