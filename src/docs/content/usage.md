---
title: Usage
description: It only takes a few lines of code to get started building components with Melt UI.
---

<script>
    import { Callout } from '$docs/components';
</script>

## Quickstart

Melt UI exposes a number of component builders. The following code snippet demonstrates a simple
collapsible component using Melt UI's [Collapsible](/docs/builders/collapsible) builder.

```svelte
<script>
	import { createCollapsible, melt } from '@melt-ui/svelte'
	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible()
</script>

<div use:melt={$root}>
	<button use:melt={$trigger}>{$open ? 'Close' : 'Open'}</button>
	<div use:melt={$content}>Obi-Wan says: Hello there!</div>
</div>
```

You'll see that `createCollapsible` returns an object with a couple of properties. Some of these are
stores, and others are stores that return functions. The stores are used to manage the state of the
component, and the functions are used to pass arguments to the element.

Each component is different, so be sure to check out the documentation before attempting to use one.

### Styling

Melt UI leaves the styling up to you. Whether you prefer scoped or global CSS, a utility framework
like [TailwindCSS](https://tailwindcss.com), or third-party components, as long as you can pass in
Melt's props, it's all good.

```svelte
<script>
  import { createCollapsible, melt } from '@melt-ui/svelte';
  import Button from '$components/button.svelte';

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible()
</script>

<!-- Using Svelte Scoped Styles -->
<div class="root" use:melt={$root}>
<!-- Using an external component -->
<Button on:click={() => console.log('clicked')} {...$trigger} action={trigger}>
  {$open ? 'Close' : 'Open'}
</Button>
<!-- Using an utility class library, such as Tailwind -->
<div class="rounded-md p-4 text-orange-500 shadow-sm" use:melt={$content}>
  Obi-Wan says: Hello there!
</div>
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
  }
</style>

<!-- Button.svelte -->
<script>
  import type { Action } from 'svelte/action';
  export let action: Action
</script>

<button use:action>
  <slot />
</button>
```

### Animations

By passing the builder's returned props to an element, certain data and aria attributes will
automatically be added and/or altered for you. These changes can then be used for animation
purposes, should you desire to do so.

```svelte
<script>
	import { createCollapsible, melt } from '@melt-ui/svelte'
	const {
		elements: { root, content, trigger }
	} = createCollapsible()
</script>

<div use:melt={$root}>
	<button use:melt={$trigger}> Toggle </button>
	<div class="content" use:melt={$content}>
		<p>sveltejs/svelte</p>
		<p>sveltejs/kit</p>
	</div>
</div>

<style>
	.content {
		display: block !important; /* Ignore the hidden attribute */
		transition: opacity 200ms ease;
	}
	.content[data-state='closed'] {
		opacity: 0;
	}
</style>
```

<Callout>
Svelte transitions can also be utilized. However, it is important to note that this may interfere with default functionality in particular components, such as focus management, so proceed with caution.<br/><br/>When using Svelte transitions, it is recommended to set the `forceVisible` prop to `true` to prevent
the component from being hidden while the transition is in progress. </Callout>

### Componentization

Usually, you'll use Melt's builders to **build** components. You can use them in an uncontrolled
manner, where props don't reactively affect the builder's internal state.

```svelte
<!-- Uncontrolled -->
<script>
	import { createCollapsible, melt } from '@melt-ui/svelte'

	// This prop only affects the initial state of the component
	export let defaultOpen = false

	const {
		elements: { root, content, trigger }
	} = createCollapsible({ defaultOpen })
</script>
```

Or you can use them in a controlled manner, where props do affect the builder's internal state.

```svelte {12-14}
<!-- Controlled -->
<script>
	import { createCollapsible, melt, createSync } from '@melt-ui/svelte'

	export let open = false

	const {
		elements: { root, content, trigger },
		states
	} = createCollapsible()

	const sync = createSync(states)
	// Whenever the open prop changes, update the local state, and vice versa
	$: sync.open(open, (value) => (open = value))
</script>
```

To get a clearer picture of the contrast between uncontrolled and controlled behavior,
[read more about it here](/docs/controlled).

## Need help?

If you run into any bugs, or would like to request a feature, please feel free to
[open an issue](https://github.com/melt-ui/melt-ui/issues/new) on GitHub.

You can also reach out to us on [Discord](https://discord.gg/cee8gHrznd) if you have any questions
or just want to chat.
