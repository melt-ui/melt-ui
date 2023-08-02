---
title: Toggle
description: A two-state button that can be either on or off.
---

<script>
    import { APIReference, KbdTable } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Toggle**: The toggle component

## Usage

To create a toggle, use the `createToggle` builder function. Follow the anatomy or the example above
to create your toggle.

### Disabling the toggle

To disable a the toggle, set the `disabled` argument to `true`.

```svelte {7,10,12}
<script lang="ts">
	import { createToggle } from '@melt-ui/svelte'

	const {
		options: { disabled }
	} = createToggle({
		disabled: true
	})
	// or
	disabled.set(true)
	// or
	disabled.update((d) => !d)
</script>
```

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Button WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

<KbdTable {keyboard} />
