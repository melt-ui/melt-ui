---
title: Switch
description: A control that allows the user to toggle between checked and not checked.
---

<script>
    import { APIReference, KbdTable } from '$docs/components'
    export let schemas;
    export let keyboard;
</script>

## Anatomy

- **Root**: The root container for the accordion
- **Input**: The native HTML input that is visually hidden

## Usage

To create a switch, use the `createSwitch` builder function. You can then reference the anatomy or
example above to create your switch.

### Disabling the switch

To disable the switch, set the `disabled` argument as `true`.

```svelte {5,8}
<script lang="ts">
	import { createSwitch } from '@melt-ui/svelte'

	const { root, input, checked, isChecked, options } = createSwitch({
		disabled: true
	})
	// or
	options.update((prev) => ({ ...prev, disabled: true }))
</script>
```

## Controlled access

To programatically control the switch, you can directly set the `checked` store. You can also update
the `options` store with new arguments.

```svelte {12,14}
<script lang="ts">
	import { createSwitch } from '@melt-ui/svelte'

	export let checked = true
	export let disabled = false

	const { checked: checkedStore, options } = createSwitch({
		disabled,
		checked
	})

	$: checkedStore.set(checked)
	checkedStore.subscribe((v) => (checked = v))
	$: options.update((o) => ({ ...o, disabled }))
</script>
```

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Switch WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)

<KbdTable {keyboard} />
