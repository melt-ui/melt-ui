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
	import { flip } from 'svelte/animate'
	import { fly } from 'svelte/transition'
	import { X } from 'lucide-svelte'
</script>

<div class="fixed bottom-0 right-0 z-50 m-4 flex flex-col items-end gap-2" use:portal>
	{#each $toasts as { id, data } (id)}
		<div
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class="rounded-lg bg-neutral-700 text-white shadow-md">
			<div
				class="relative flex w-[24rem] max-w-[calc(100vw-2rem)] items-center justify-between gap-4 p-5">
				<div>
					<h3 use:melt={$title(id)} class="flex items-center gap-2 font-semibold">
						{data.title}
						<span class="rounded-full square-1.5 {data.color}" />
					</h3>
					<div use:melt={$description(id)}>
						{data.description}
					</div>
				</div>
				<button
					use:melt={$close(id)}
					class="absolute right-4 top-4 grid place-items-center rounded-full text-magnum-500 square-6
          hover:bg-magnum-900/50">
					<X class="square-4" />
				</button>
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
				color: 'bg-green-500'
			}
		})
	}
</script>

<button
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium leading-none
  text-magnum-700 shadow-lg hover:opacity-75"
	on:click={create}>
	Create
</button>
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
