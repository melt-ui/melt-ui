---
title: Context Menu
description:
  Displays a menu at the pointer's position when the trigger is right-clicked or long-pressed.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
    export let previews
    export let snippets
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

The first thing you need to do is create a dropdown menu using the `createDropdownMenu` function.

```svelte {3}
<script lang="ts">
	import { createContextMenu } from '@melt-ui/svelte'
	const { menu, item, trigger, arrow } = createContextMenu()
</script>
```

Then you can use the `menu`, `item`, and `trigger` to construct a dropdown menu. A high level
example of how to structure the menu is shown below.

```svelte
<script lang="ts">
	import { createContextMenu } from '@melt-ui/svelte'
	const { menu, item, trigger, arrow } = createContextMenu()
</script>

<span melt={$trigger}>Right click here.</span>
<div melt={$menu}>
	<div {...$item} use:item>...</div>
	<div {...$item} use:item>...</div>
	<div {...$item} use:item>...</div>
	<div melt={$arrow} />
</div>
```

The `trigger` sits outside of the `menu` and is used to toggle the menu's open state. The `item`
elements go inside the `menu` element. The `arrow` element is optional and can be used to render an
arrow which points to the trigger.

At this point, our menu doesn't really do much except open and close. To add functionality, we could
turn the `item` elements into links, or we could pass a custom `onSelect` function to the item
action, which will be called when that item is selected.

```svelte
<a href="/1" {...$item} use:item>Item 1</a>
<div {...$item} use:item={{ onSelect: (e) => console.log('Item 2!') }}>Item 2</div>
<div {...$item} use:item={{ onSelect: (e) => console.log('Item 3!') }}>Item 3</div>
```

If you wanted to prevent the default behavior that occurs when you select an item, you can call
`e.preventDefault()` in your `onSelect` function, which will prevent the default behavior from
occurring.

```svelte
<div
	{...$item}
	use:item={{
		onSelect: (e) => {
			e.preventDefault()
		}
	}}>
	Item 2
</div>
```

## Example Components

### Controlled

You can control the open state of the menu as we have in this example. Obviously this is not an
ideal example for a context menu, which are typically triggered by a right click, but it does
demonstrate how you could control it if you wanted to.

<Preview code={snippets.controlled}>
    <svelte:component this={previews.controlled} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Menu WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)

<KbdTable {keyboard} />
