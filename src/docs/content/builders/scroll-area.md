---
title: Scroll Area
description: Provides consistent scrollbars across platforms.
---

<script>
	import { APIReference, Preview, Callout } from '$docs/components'
	import { A } from '$docs/components/markdown';
	export let snippets
	export let previews
	export let schemas
</script>

## Anatomy

- **Root**: The container that wraps all parts of the scroll area
- **Viewport**: A container that wraps the scrollable content
- **Content**: The scrollable content
- **Corner**: The corner element displayed when both scrollbars are visible
- **ScrollbarX**: The track of the X scrollbar
- **ThumbX**: The thumb of the X scrollbar
- **ScrollbarY**: The track of the Y scrollbar
- **ThumbY**: The thumb of the Y scrollbar

## Examples

### Always

When the `type` is set to `always`, the scrollbars will always be visible.

<Preview code={snippets.always} variant="dark" size="auto">
	<svelte:component this={previews.always} />
</Preview>

### Auto

When the `type` is set to `auto`, the scrollbars will only be visible when the content overflows.

<Preview code={snippets.auto} variant="dark" size="auto">
	<svelte:component this={previews.auto} />
</Preview>

### Hover

When the `type` is set to `hover`, the scrollbars will only be visible when the mouse is over the
scroll area.

<Preview code={snippets.hover} variant="dark" size="auto">
	<svelte:component this={previews.hover} />
</Preview>

### Scroll

When the `type` is set to `scroll`, the scrollbars will only be visible when the user is scrolling.

<Preview code={snippets.scroll} variant="dark" size="auto">
	<svelte:component this={previews.scroll} />
</Preview>

## API Reference

<APIReference {schemas} />
