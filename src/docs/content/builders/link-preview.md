---
title: Link Preview
description: Enable sighted users to preview content behind a link.
---

<script>
    import { KbdTable, APIReference, Callout } from '$docs/components'
    export let schemas
</script>

<Callout type="warning">

⚠️ The Link Preview is only intended to be used with a mouse or other pointing device and doesn't
respond to keyboard or touch events. On touch devices, the link will be followed immediately.

</Callout>

## Anatomy

- **Trigger**: The element that opens the linkpreview on hover.
- **Content**: The element containing the content for the linkpreview.
- **Arrow**: An optional arrow component

## Usage

Create a linkpreview using the `createLinkPreview` builder function.

```svelte {3-5}
<script lang="ts">
	import { createLinkPreview, melt } from '@melt-ui/svelte'
	const {
		elements: { trigger, content, arrow }
	} = createLinkPreview()
</script>
```

Then you can use the `trigger`, `content`, and `arrow` to construct a linkpreview. A high level
example of how to structure the linkpreview is shown below.

```svelte
<script lang="ts">
	import { createLinkPreview, melt } from '@melt-ui/svelte'
	const {
		elements: { trigger, content, arrow }
	} = createLinkPreview()
</script>

<button use:melt={$trigger}>Hover Me</button>

<div use:melt={$content}>
	<div>I am content inside the link preview</div>
	<div use:melt={$arrow} />
</div>
```

It's also possible to use Svelte Transitions, as demonstrated in the example at the top of this
page.

## API Reference

<APIReference {schemas} />

## Accessibility

The link preview is only intended to be used with a mouse or other pointing device and doesn't
respond to keyboard events.
