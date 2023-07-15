---
title: Accordion
description:
  An interactive component that enables the organization and navigation of content by allowing users
  to expand and collapse sections.
---

<script>
    import { KbdTable, APIReference, Preview, Callout } from '$docs/components'
    export let schemas
    export let keyboard
    export let snippets
    export let previews
</script>

## Anatomy

- **Root**: The root container for the accordion
- **Item**: The container for each accordion item
- **Trigger**: The trigger for the accordion item
- **Content**: The content area that is revealed when the trigger is clicked

## Usage

To create an accordion, use the `createAccordion` builder function. Follow the anatomy or the
example at the top of this page to create your accordion.

<Callout type="warning">
To ensure the accordion you create is accessible, wrap the trigger in an element with the <code>role="heading"</code> attribute, and set the <code>aria-level</code> attribute to the appropriate heading level. Alternatively, you can wrap the trigger in a heading element, as we have done in the preview above.
</Callout>

### Disabling a single item

To disable a single item, you can pass in an object instead of a string to the function.

```svelte /{ value: 'item-3', disabled: true }/#hi
<div class="accordion-item" melt={$item({ value: 'item-3', disabled: true })}>Item 3</div>
```

<Preview code={snippets.disabled}>
    <svelte:component this={previews.disabled} />
</Preview>

### Opening multiple items at once

Pass in the `type` argument to `createAccordion` with a value of `'multiple'`.

```svelte {3}
<script lang="ts">
  const { content, item, trigger, isSelected, root } = createAccordion({
    type: 'multiple'
  })
</script>
```

<Preview code={snippets.multiple}>
    <svelte:component this={previews.multiple} />
</Preview>

### Controlled access

To programatically control the Accordion, you can directly set the `value` store. You can also
update the `options` store with new arguments.

```svelte {4,15,19,21}
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
  }}>
  Trigger randomly
</button>

<p>Value: {value} Value Store: {$valueStore}</p>

<div melt={$root}>
  <div melt={$item('item-1')}>
    <button melt={$trigger('item-1')}>Is it accessible?</button>
    <div melt={$content('item-1')}>
      <div>Yes. It adheres to the WAI-ARIA design pattern.</div>
    </div>
  </div>

  <div melt={$item('item-2')}>
    <button melt={$trigger('item-2')}>Is it accessible?</button>
    <div melt={$content('item-2')}>
      <div>Yes. It adheres to the WAI-ARIA design pattern.</div>
    </div>
  </div>

  <div melt={$item('item-3')}>
    <button melt={$trigger('item-3')}>Is it accessible?</button>
    <div melt={$content('item-3')}>
      <div>Yes. It adheres to the WAI-ARIA design pattern.</div>
    </div>
  </div>
</div>
```

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Accordion WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)

<KbdTable {keyboard} />
