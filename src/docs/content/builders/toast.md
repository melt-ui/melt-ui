---
title: Toast
description: A succinct message that is displayed temporarily.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
    export let snippets
    export let previews
</script>

## Anatomy

- **Content**: Container for the content within the toast
- **Title**: The title of the toast
- **Description**: The description which supports the title
- **Close**: The button(s) that close the toast

## Usage

Unlike most builders, the toast is not component-based. Instead, it provides a global functionality
that can be accessed from anywhere in your application. To accomplish this, it is recommended that
you create a global component that is called on the root of your application.

The first step is to create a `Toaster` component that will be used to render toast notifications.
We can take advantage of
[Svelte context module](https://svelte.dev/docs/svelte-components#script-context-module) to create
the template for the toast notifications and expose the helper function so it can be used in other
components.

```svelte
<script lang="ts" context="module">
	export type ToastData = {
		title: string
		description: string
		color: string
	}

	const {
		elements: { content, title, description, close },
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>()

	export const addToast = helpers.addToast
</script>

<script lang="ts">
	import { createToaster, melt } from '@melt-ui/svelte'
</script>

<div use:portal>
	{#each $toasts as { id, data } (id)}
		<div use:melt={$content(id)}>
			<div>
				<div>
					<h3 use:melt={$title(id)}>
						{data.title}
						<span style:color={data.color} />
					</h3>
					<div use:melt={$description(id)}>
						{data.description}
					</div>
				</div>
				<button use:melt={$close(id)} aria-label="close notification"> X </button>
			</div>
		</div>
	{/each}
</div>
```

This component should be added to your root `+layout.svelte` or `App.svelte` component.

```svelte
<script>
	import Toaster from '$lib/Toaster.svelte'
</script>

<Toaster />

<slot />
```

Finally, you can use the exported `addToast` helper function to add a toast from any component of
the application.

```svelte
<script lang="ts">
	import { addToast } from '$lib/Toaster.svelte'

	function create() {
		addToast({
			data: {
				title: 'Success',
				description: 'The resource was created!',
				color: 'green'
			}
		})
	}
</script>

<button on:click={create}> Create </button>
```

### Overriding default values for individual toasts

While you can define some global values for the Toaster on initialization, it is possible to
override these defaults for individual toasts using the `addToast` helper function.

```svelte
<script lang="ts">
	const { helpers } = createToaster({
		closeDelay: 5000, // defaults to 5000
		type: 'background' // defaults to 'background'
	})

	// an example using the default values
	function create() {
		addToast({
			data
		})
	}

	// an example overriding the default values
	function createImportant() {
		addToast({
			data,
			closeDelay: 10000, // override the default closeDelay
			type: 'foreground' // override the default type
		})
	}
</script>

<button on:click={create}> Create </button>

<button on:click={createImportant}> Create Important </button>
```

## Example Components

### With Progress

Each individual `toast` item provides a `getPercentage` helper function to determine the percentage
of the time elapsed at any given moment. You can use that to provide a progress bar to your toasts

<Preview code={snippets.progress}>
    <svelte:component this={previews.progress} />
</Preview>

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Alert WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)

<KbdTable {keyboard} />
