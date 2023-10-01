---
title: Calendar
description: A calendar component for selecting & displaying dates.
---

<script>
	import { Preview } from '$docs/components'
	export let snippets
	export let previews
</script>

## Example Components

### Multi-Select Date Picker

<Preview code={snippets.multiple}>
    <svelte:component this={previews.multiple} />
</Preview>

### Range Date Picker

<Preview code={snippets.range}>
    <svelte:component this={previews.range} />
</Preview>
