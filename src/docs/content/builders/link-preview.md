---
title: Link Preview
description: Enable sighted users to preview content behind a link.
---

<script>
    import { KbdTable, APIReference, Callout } from '$docs/components'
    export let schemas
</script>

<Callout type="warning">

⚠️ The Link Preview is only intended to be used with a mouse or other pointing device. It doesn't
respond to touch events, and the preview content cannot be accessed via the keyboard. On touch
devices, the link will be followed immediately.

</Callout>

## Anatomy

- **Trigger**: The element that opens the link preview on hover.
- **Content**: The element containing the content for the link preview.
- **Arrow**: An optional arrow component

## Usage

Create a link preview using the `createLinkPreview` builder function.

```svelte {3-5}
<script lang="ts">
	import { createLinkPreview, melt } from '@melt-ui/svelte'
	const {
		elements: { trigger, content, arrow }
	} = createLinkPreview()
</script>
```

Then you can use the `trigger`, `content`, and `arrow` to construct a link preview. A high level
example of how to structure the link preview is shown below.

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

### Focus handling

By default the link preview will be shown when focused by the keyboard (or more specifically if
`:focus-visible` would apply), and hide on blur.

You can disable this functionality by listening to and cancelling the custom `m-focus` and `m-blur`
events.

```svelte {3-8}
<button
	use:melt={$trigger}
	on:m-focus={(e) => {
		e.preventDefault()
	}}
	on:m-blur={(e) => {
		e.preventDefault()
	}}>
	Hover Me
</button>
```

## API Reference

<APIReference {schemas} />

## Accessibility

The link preview is only intended to be used with a mouse or other pointing device and the preview
content cannot be accessed via the keyboard and is not exposed to screen readers.
