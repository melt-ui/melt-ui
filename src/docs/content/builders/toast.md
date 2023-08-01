---
title: Toast
description: A succinct message that is displayed temporarily.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Content**: Container for the content within the toast
- **Title**: The title of the toast
- **Description**: The description which supports the title
- **Close**: The button(s) that close the toast

## Usage

Unlike most builders, the toast is not component-based. Instead, it provides a global functionality
that can be accessed from anywhere in your application. To accomplish this, it is recommended that
you call the builder function `createToaster` inside the lib directory. This will make the function
accessible to all components in your application.

```typescript
import { createToaster } from '@melt-ui/svelte'

export type ToastData = {
	title: string
	description: string
	color: string
}

export const {
	elements: { content, title, description, close },
	helpers: { addToast },
	states: { toasts },
	actions: { portal }
} = createToaster<ToastData>()
```

The second step is to create a `Toast` component that will be used to render toast notifications.

```svelte
<script lang="ts">
	import { flip } from 'svelte/animate'
	import { fly } from 'svelte/transition'
	import { melt } from '@melt-ui/svelte'
	import X from '~icons/lucide/x'
	import { toasts, content, portal, title, description, close } from './toast'
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
					<X />
				</button>
			</div>
		</div>
	{/each}
</div>
```

This component should be added to your root `+layout.svelte` or `App.svelte` component.

```svelte
<script>
	import Toast from '$lib/Toast.svelte'
</script>

<Toast />

<slot />
```

Finally, you can use the exported `addToast` function to add a toast from any component of the
application.

```svelte
<script lang="ts">
	import { addToast } from '$lib/toast'

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

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the [Alert WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)

<KbdTable {keyboard} />
