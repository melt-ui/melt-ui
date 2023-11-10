---
title: Dialog
description:
  A window overlaid on either the primary window or another dialog window, rendering the content
  underneath inert.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
    export let snippets
    export let previews
</script>

## Anatomy

At a high level, the anatomy of a dialog looks like this:

```svelte
<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte'
	const {
		elements: { trigger, portalled, overlay, content, title, description, close },
		states: { open }
	} = createDialog()
</script>

<button use:melt={$trigger}> Open Dialog </button>

<div use:portal>
	{#if $open}
		<div use:melt={$overlay} />
		<div use:melt={$content}>
			<h2 use:melt={$title}>Dialog Title</h2>
			<p use:melt={$description}>Dialog description</p>
			<button use:melt={$close}> Close Dialog </button>
		</div>
	{/if}
</div>
```

- **Trigger**: The button(s) that open the dialog
- **Portalled**: The container that is portalled (to `body`, by default)
- **Overlay**: The dim background that is typically behind a dialog element.
- **Content**: Container for the content within the dialog.
  - **Title**: The title of the dialog
  - **Description**: The description which supports the title
  - **Close**: The button(s) that close the dialog

## Usage

To create a dialog, use the `createDialog` builder function. You can then reference the anatomy,
example above, or the [Example Components](#example-components) below to create your dialog.

### Dialog vs. Alert Dialog

You should use a _dialog_ to display content that isn't critical to the user's workflow. For
example, a user may need to select a color or a chart, but the chart will still be displayed even if
the user does not select a color. In this case, a dialog would be appropriate.

On the other hand, an _alert dialog_ should be used to display content that is critical to the
user's workflow. For example, a user may need to confirm a decision before proceeding. In this case,
an alert dialog would be appropriate.

By default, we set the `role` attribute to `dialog`. If you want it to be considered an alert
dialog, you can set the `role` builder prop to `alertdialog`.

```ts {2}
const dialog = createDialog({
	role: 'alertdialog'
})
```

### Disable Scroll Prevention

By default, scrolling is prevented on the body when a dialog is open. You can disable this behavior
by setting the `preventScroll` builder prop to `false`.

```ts {2}
const dialog = createDialog({
	preventScroll: false
})
```

### Disable Close on Outside Click

By default, clicking outside of the dialog will close it. You can disable this behavior by setting
the `closeOnOutsideClick` builder prop to `false`.

```ts {2}
const {
	/* ... */
} = createDialog({
	closeOnOutsideClick: false
})
```

### Disable Close on Escape

By default, pressing the escape key will close the dialog. You can disable this behavior by setting
the `closeOnEscape` builder prop to `false`.

```ts {2}
const dialog = createDialog({
	closeOnEscape: false
})
```

## Example Components

### Drawer

An overlay window can display various content, including dialogs, drawers, sidebars, and more. For
example, here's a drawer component that slides in from the left side of the screen. A drawer could
be used for a navigation menu, a settings panel, or any other content that you want to display in a
drawer.

<Preview code={snippets.drawer}>
    <svelte:component this={previews.drawer} />
</Preview>

### Alert Dialog

It's common to use a dialog as a pop-up decision window or alert dialog. For example, here's a
pop-up that asks the user to confirm a decision.

<Preview code={snippets.alert}>
    <svelte:component this={previews.alert} />
</Preview>

### Nested Dialogs

Dialogs can be nested. For example, here's a dialog that opens another dialog.

<Preview code={snippets.nested}>
    <svelte:component this={previews.nested} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Dialog WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) &
[Alert Dialog WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)

<KbdTable {keyboard} />
