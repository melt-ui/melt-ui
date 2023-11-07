---
title: Preprocessor
description: Simplifying the syntax of Melt UI using a custom preprocessor.
---

## What it does

We provide a custom preprocessor that aims to enhance the DX of Melt UI just a bit further. It
introduces a new action, `melt`, that accepts our builders as values. This helps trim down on the
boilerplate just enough to keep the markup nice and tidy. The preprocessor will then transform our special
attribute into the proper Svelte syntax.

## How it works

In the simplest form, the preprocessor will take the following code:

```svelte
<script>
	import { createCollapsible, melt } from '@melt-ui/svelte'
	const { open, root, content, trigger } = createCollapsible()
</script>

<div use:melt={$root}>
	<button use:melt={$trigger}>{$open ? 'Close' : 'Open'}</button>
	<div use:melt={$content}>Obi-Wan says: Hello there!</div>
</div>
```

and transform it into this:

```svelte
<script>
	import { createCollapsible } from '@melt-ui/svelte'
	const { open, root, content, trigger } = createCollapsible()
</script>

<div {...$root} use:$root.action>
	<button {...$trigger} use:$trigger.action>{$open ? 'Close' : 'Open'}</button>
	<div {...$content} use:$content.action>Obi-Wan says: Hello there!</div>
</div>
```

It can handle more complex scenarios, such as a builder that is a call expression with dependencies:

```svelte
<script>
	import { createBuilder, melt } from '@melt-ui/svelte'
	const { builder } = createBuilder()
</script>

{#each Array(100) as _, i}
	<!-- Just a normal call expression -->
	<div use:melt={$builder({ arg: i })} />
{/each}
```

## Installation

For installation instructions, please see the [installation](/docs/installation) page.
