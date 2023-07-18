---
title: Accordion
description:
  An interactive component that enables the organization and navigation of content by allowing users
  to expand and collapse sections.
---

<script>
    import { KbdTable, APIReference, Preview } from '$docs/components'
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

### Ensuring items are accessible

The easy way to ensure your accordion items are accessible is to wrap each trigger element in a
heading element, like so:

```svelte
<h2>
  <button melt={$trigger(id)}>
    {title}
  </button>
</h2>
```

However, there may be times when you can't use or don't want to use a heading element. In those
cases, use the `heading` builder to apply the necessary aria attributes to the element. The argument
passed to the `heading` builder is the heading level you wish to use. In the example below, we set
the heading level to 4.

```svelte /heading/#hi
<script lang="ts">
  const { content, item, trigger, isSelected, root, heading } = createAccordion()
</script>
```

```svelte {1}
<span melt={$heading(4)}>
    <button melt={$trigger(id)}>
        {title}
    </button>
<span>
```

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
</>
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
