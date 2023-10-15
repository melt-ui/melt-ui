---
title: Transitions
description: Learn how to use Svelte & other custom transitions and animations with Melt.
---

By default, the visibility of most elements you'd want to apply transitions to are controlled by
Melt internally. We set the element's `hidden` attribute to `true`, and the display to `none` when
the open state is false. We do this to prevent flickering when the component is first rendered.

However, while this works well for those who don't want to use transitions or animations, it can
degrade the quality for those who do, so we provide a way to disable this behavior and manage
visibility yourself.

## Force Visible

For builders that hide/show elements by default, we provide a `forceVisible` prop that if set to
`true`, will prevent Melt from toggling the visibility of the element and place the responsibility
of showing/hiding the element on you.

The elements which accept this prop will return an `open` store that you can use manage visibility
of the element using `#if` blocks, which will allow you to apply transitions and animations.

At a high level, here's how you could use the `forceVisible` prop with the Collapsible builder.

```svelte {9,15,17} /transition:slide/#hi
<script lang="ts">
	import { createCollapsible, melt } from '@melt-ui/svelte'
	import { slide } from 'svelte/transition'

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible({
		forceVisible: true
	})
</script>

<div use:melt={$root}>
	<button use:melt={$trigger} aria-label="Toggle"> Open </button>
	{#if $open}
		<div use:melt={$content} transition:slide>Collapsible content</div>
	{/if}
</div>
```

As you can see we're using the `forceVisible` prop to prevent Melt from toggling the visibility of
the content element, and instead we're using the `open` store to manage the visibility ourselves.
This way we can use the `#if` block to apply the `slide` transition.
