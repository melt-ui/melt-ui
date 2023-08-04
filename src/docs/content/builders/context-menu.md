---
title: Context Menu
description:
  Displays a menu at the pointer's position when the trigger is right-clicked or long-pressed.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Trigger**: The element which when right clicked, opens the context menu.
- **Menu**: The root container for the popover menu
- **Item**: A menuitem which can be a link or a function.
- **Checkbox Item**: A menu item which can be checked or unchecked.
- **Radio Group**: A group of radio items.
- **Radio Item**: A menu item which can be selected from a group of items.
- **Sub Trigger**: A button which toggles the submenu's open state.
- **Sub Menu**: A menu which is nested inside another menu.
- **Separator**: A visual divider between menu items.

## Usage

The first thing you need to do is create a context menu using the `createContextMenu` function.

```svelte {3-5}
<script lang="ts">
	import { createContextMenu, melt } from '@melt-ui/svelte'
	const {
		elements: { menu, item, trigger, arrow }
	} = createContextMenu()
</script>
```

Then you can use the `menu`, `item`, and `trigger` to construct a context menu. A high level example
of how to structure the menu is shown below.

```svelte
<script lang="ts">
	import { createContextMenu, melt } from '@melt-ui/svelte'
	const {
		elements: { menu, item, trigger, arrow }
	} = createContextMenu()
</script>

<button use:melt={$trigger}>Click me</button>
<div use:melt={$menu}>
	<div use:melt={$item}>...</div>
	<div use:melt={$item}>...</div>
	<div use:melt={$item}>...</div>
	<div use:melt={$arrow} />
</div>
```

The `trigger` sits outside of the `menu` and is used to toggle the menu's open state. The `item`
elements go inside the `menu` element. The `arrow` element is optional and can be used to render an
arrow which points to the trigger.

At this point, our menu doesn't really do much except open and close. To add functionality, we could
turn the `item` elements into links, or we could pass a `m-click` listener function to the item
action, which will be called when that item is pressed (Space and Enter keys also trigger the click
event for items).

```svelte /on:m-click={(e) => console.log('Item 2!')}/#hi /on:m-click={(e) => console.log('Item 3!')}/#hi
<a href="/1" use:melt={$item}>Item 1</a>
<div use:melt={$item} on:m-click={(e) => console.log('Item 2!')}>Item 2</div>
<div use:melt={$item} on:m-click={(e) => console.log('Item 3!')}>Item 3</div>
```

If you wanted to prevent the default behavior that occurs when you select an item, you can call
`e.detail.cancel()` in your `on:m-click` listener, which will prevent the default behavior from
occurring.

```svelte {4}
<div
	use:melt={$item}
	on:m-click={(e) => {
		e.detail.cancel()
	}}>
	Item 2
</div>
```

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Menu WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)

<KbdTable {keyboard} />
