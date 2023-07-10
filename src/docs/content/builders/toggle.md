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

```svelte {5,8,10}
<script lang="ts">
  import { createToggle } from '@melt-ui/svelte'

  const { toggle, pressed, disabled } = createToggle({
    disabled: true
  })
  // or
  disabled.set(true)
  // or
  disabled.update((d) => !d)
</script>
```

### Controlled access

To programmatically control the Toggle, you can directly set the `pressed` store. you can also
directly set the `disabled` store.

```svelte {4-5,8-9,12-13,15-16}
<script lang="ts">
  import { createToggle } from '@melt-ui/svelte'

  export let pressed = true
  export let disabled = false

  const { pressed: pressedStore, disabled: disabledStore } = createToggle({
    pressed,
    disabled
  })

  $: pressedStore.set(pressed)
  pressedStore.subscribe((v) => (pressed = v))

  $: disabledStore.set(pressed)
  disabledStore.subscribe((v) => (disabled = v))
</script>
```

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Button WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

<KbdTable {keyboard} />
