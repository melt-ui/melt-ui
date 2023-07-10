---
title: Menubar
description:
  Displays a menu to the user, which can consist of links or functions, triggered by a button.
---

<script>
    import { APIReference, KbdTable } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Trigger**: The button which toggles the menu's open state.
- **Menu**: The root container for the popover menu
- **Item**: A menuitem which can be a link or a function.
- **Checkbox Item**: A menu item which can be checked or unchecked.
- **Radio Group**: A group of radio items.
- **Radio Item**: A menu item which can be selected from a group of items.
- **Sub Trigger**: A button which toggles the submenu's open state.
- **Sub Menu**: A menu which is nested inside another menu.
- **Separator**: A visual divider between menu items.

## Usage

The first thing you'll need to do is create a menubar using the `createMenubar` builder function.

```svelte {4}
<script lang="ts">
  import { createMenubar } from '@melt-ui/svelte'

  const { menubar, createMenu } = createMenubar()
</script>
```

This function returns an object containing the `menubar` attributes object, and a `createMenu`
function. The `createMenu` function is used the same way as the `createDropdownMenu` builder from
the Dropdown Menu builder. The only difference is that using this function keeps the menu scoped to
the menubar which happens behind the scenes.

Now that we have a menubar and menu builder function, we can create a menu using the `createMenu`
function and wrap it in a `menubar` element.

```svelte {5}
<script lang="ts">
  import { createMenubar } from '@melt-ui/svelte'

  const { menubar, createMenu } = createMenubar()
  const { menu, item, trigger } = createMenu()
</script>

<div {...menubar}>
  <button {...$trigger} use:trigger>Open Menu</button>
  <div {...$menu} use:menu>
    <div {...$item} use:item>...</div>
    <div {...$item} use:item>...</div>
    <div {...$item} use:item>...</div>
  </div>
</div>
```

This isn't much of a "menubar" though, as typically a menubar consists of multiple menus, so let's
add a couple more.

Since each `menu` needs to have it's own "scope", we'll need to call the `createMenu` function again
for each menu we want to create. If you're doing this all in one file, it can get a bit messy, so
I'd recommend componentizing each menu. But for the sake of this example, we'll just rename the
returned variables to prevent any naming conflicts.

```svelte {6-7}
<script lang="ts">
  import { createMenubar } from '@melt-ui/svelte'

  const { menubar, createMenu } = createMenubar()
  const { menu, item, trigger } = createMenu()
  const { menu: menuA, item: itemA, trigger: triggerA } = createMenu()
  const { menu: menuB, item: itemB, trigger: triggerB } = createMenu()
</script>

<div {...menubar}>
  <button {...$trigger} use:trigger>File</button>
  <div {...$menu} use:menu>
    <div {...$item} use:item>...</div>
    <div {...$item} use:item>...</div>
    <div {...$item} use:item>...</div>
  </div>

  <button {...$triggerA} use:triggerA>Edit</button>
  <div {...$menuA} use:menuA>
    <div {...$itemA} use:itemA>...</div>
    <div {...$itemA} use:itemA>...</div>
    <div {...$itemA} use:itemA>...</div>
  </div>

  <button {...$triggerB} use:triggerB>Help</button>
  <div {...$menuB} use:menuB>
    <div {...$itemB} use:itemB>...</div>
    <div {...$itemB} use:itemB>...</div>
    <div {...$itemB} use:itemB>...</div>
  </div>
</div>
```

Now we have a menubar with three menus, each with their own items and scopes. As mentioned
previously, the functionality of createMenu is the exact same as createDropdownMenu, so you can
refer to the [Dropdown Menu](/docs/builders/dropdown-menu) documentation for more information on how
to use it.

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Menu WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) &
[Menu Button WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/)

<KbdTable {keyboard} />
