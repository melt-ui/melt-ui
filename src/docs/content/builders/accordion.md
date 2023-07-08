---
title: Accordion
description:
  An interactive component that enables the organization and navigation of content by
  allowing users to expand and collapse sections.
---

## Anatomy

- **Root**: The root container for the accordion
- **Item**: The container for each accordion item
- **Trigger**: The trigger for the accordion item
- **Content**: The content area that is revealed when the trigger is clicked

## Usage

To create an accordion, use the `createAccordion` builder function. Follow the anatomy or
the example at the top of this page to create your accordion.

### Disabling a single item

To disable a single item, you can pass in an object instead of a string to the function.

```svelte /{ value: 'item-3', disabled: true }/#hi
<div class="accordion-item" {...$item({ value: 'item-3', disabled: true })}>Item 3</div>
```

### Opening multiple items at once

Pass in the `type` argument to `createAccordion` with a value of `'multiple'`.

```svelte {3}
<script lang="ts">
  const { content, item, trigger, isSelected, root } = createAccordion({
    type: 'multiple'
  })
</script>
```

### Controlled access

To programatically control the Accordion, you can directly set the `value` store. You can
also update the `options` store with new arguments.

```svelte
<script lang="ts">
  import { createAccordion } from '@melt-ui/svelte'

  let value: string | string[] | undefined = 'item-1'
  let disabled = false

  const {
    content,
    item,
    trigger,
    root,
    value: valueStore,
    options
  } = createAccordion({
    value,
    disabled
  })

  $: valueStore.set(value)
  valueStore.subscribe((v) => (value = v))
  $: options.update((o) => ({ ...o, disabled }))
</script>

<button
  on:click={() => {
    const randPick = Math.floor(Math.random() * 3) + 1
    value = `item-${randPick}`
  }}
>
  Trigger randomly
</button>

<p>Value: {value} Value Store: {$valueStore}</p>

<div {...root}>
  <div {...$item('item-1')}>
    <button {...$trigger('item-1')} use:trigger>Is it accessible?</button>
    <div {...$content('item-1')}>
      <div>Yes. It adheres to the WAI-ARIA design pattern.</div>
    </div>
  </div>

  <div {...$item('item-2')}>
    <button {...$trigger('item-2')} use:trigger>Is it accessible?</button>
    <div {...$content('item-2')}>
      <div>Yes. It adheres to the WAI-ARIA design pattern.</div>
    </div>
  </div>

  <div {...$item('item-3')}>
    <button {...$trigger('item-3')} use:trigger>Is it accessible?</button>
    <div {...$content('item-3')}>
      <div>Yes. It adheres to the WAI-ARIA design pattern.</div>
    </div>
  </div>
</div>
```
