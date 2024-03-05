---
title: Popover
description: Displays rich content in a portal, triggered by a button.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components' 
    export let schemas
    export let keyboard
    export let snippets
    export let previews
</script>

## Anatomy

- **Trigger**: The button(s) which open/close the popover.
- **Content**: The content area viewed when the trigger is clicked.
- **Arrow**: An optional arrow component
- **Close**: A button which closes the popover

## Usage

To create a popover, use the `createPopover` builder function. Follow the anatomy or the example
above to create your popover.

### Default open state

To specify that the popover should be open by default, set the `defaultOpen` prop to `true`.

```ts {2}
const {
	/** ... */
} = createPopover({
	defaultOpen: true
})
```

### Controlled usage

To control the popover directly, you can use the `onOpenChange` prop, which accepts a callback.

The callback will be called with an object containing two properties: `prev` and `next`. Prev
indicates the previous open state, and next indicates the next open state that would take place in
uncontrolled usage. The value returned by the callback will be used as the next open state.

```ts {2,3,4,5,6,7,8}
const popover = createPopover({
  onOpenChange: ({ curr, next }) => {
    // Do something with the open state
    if (/* some condition */) {
      return false
    }
    return next
  }
})
```

You can also pass in your own store to control the open state. This is useful when you want to
control the open state from outside the popover, or use an outside store that is already being used
elsewhere in your application.

If you don't pass an `open` prop, the builder will create a store for you, and return it.

```ts {1,4}
const open = writable(false)

const popover = createPopover({
	open
})
```

### Modal Behavior

To give the popover modal behavior, where body scrolling is disabled and an overlay is rendered
behind the popover to prevent interaction with the rest of the page, use the `preventScroll` prop
and `overlay` builder element.

```svelte
<script lang="ts">
	import { createPopover, melt } from '@melt-ui/svelte'

	const {
		elements: { content, trigger, overlay, close, arrow }
	} = createPopover({
		preventScroll: true
	})
</script>

<button type="button" use:melt={$trigger}> Open </button>
<div use:melt={$overlay} />
<div use:melt={$content}>
	<div use:melt={$arrow} />
	<div>
		<!-- ... -->
	</div>
	<button use:melt={$close}> Close </button>
</div>
```

The [Modal Popover](#modal-popover) example below demonstrates this behavior in action.

## Example Components

### Nested Popovers

<Preview code={snippets.nested}>
    <svelte:component this={previews.nested} />
</Preview>

### Modal Popover

<Preview code={snippets.modal}>
	<svelte:component this={previews.modal} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Dialog WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal)

<KbdTable {keyboard} />
