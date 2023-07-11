---
title: Checkbox
description: A control that allows the user to toggle between checked and not checked.
---

<script>
    import { APIReference, KbdTable } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Root**: The root container for the checkbox
- **Input**: The native html input element that is hidden from view

## Usage

To create a checkbox, use the `createCheckbox` builder function. Follow the anatomy or the example
above to create your checkbox.

### Indeterminate state

To create an indeterminate checkbox, set the `checked` argument as `indeterminate`.

```svelte {5,8}
<script lang="ts">
  import { createCheckbox } from '@melt-ui/svelte'

  const { root, input, isChecked, isIndeterminate, checked } = createCheckbox({
    checked: 'indeterminate'
  })
  // or
  checked.set('indeterminate')
</script>
```

### Disabling the checkbox

To disable the checkbox, set the `disabled` argument as `true`.

```svelte /disabled: true/#hi /options.update((prev) => ({ ...prev, disabled: true }))/#hi
<script lang="ts">
  import { createCheckbox } from '@melt-ui/svelte'

  const { root, input, isChecked, isIndeterminate, checked, options } = createCheckbox({
    disabled: true
  })
  // or
  options.update((prev) => ({ ...prev, disabled: true }))
</script>
```

### Controlled access

To programatically control the checkbox, you can directly set the `checked` store. You can also
update the `options` store with new arguments.

```svelte {12,14}
<script lang="ts">
  import { createCheckbox } from '@melt-ui/svelte'

  export let checked: boolean | 'indeterminate' = true
  export let disabled = false

  const { checked: checkedStore, options } = createCheckbox({
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

Adheres to the
[tri-state Checkbox WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)

<KbdTable {keyboard} />
