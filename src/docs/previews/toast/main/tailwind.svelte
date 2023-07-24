<script lang="ts">
	import { createToaster } from '@melt-ui/svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import X from '~icons/lucide/x';

	type ToastData = {
		title: string;
		description: string;
		color: string;
	};

	const {
		elements: { content, title, description, close },
		helpers: { addToast },
		states: { toasts },
		actions: { portal },
	} = createToaster<ToastData>();

	const toastData: ToastData[] = [
		{
			title: 'Success',
			description: 'Congratulations! It worked!',
			color: 'bg-green-500',
		},
		{
			title: 'Warning',
			description: 'Please check again.',
			color: 'bg-orange-500',
		},
		{
			title: 'Error',
			description: 'Something did not work!',
			color: 'bg-red-500',
		},
	];

	function addRandomToast() {
		addToast({ data: toastData[Math.floor(Math.random() * toastData.length)] });
	}
</script>

<button
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium leading-none
	text-magnum-700 shadow-lg hover:opacity-75"
	on:click={addRandomToast}
>
	Show toast
</button>

<div
	class="fixed bottom-0 right-0 z-50 m-4 flex flex-col items-end gap-2"
	use:portal
>
	{#each $toasts as { id, data } (id)}
		<div
			melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class="rounded-lg bg-neutral-800 text-white shadow-md"
		>
			<div
				class="relative flex w-[24rem] max-w-[calc(100vw-2rem)] items-center justify-between gap-4 p-5"
			>
				<div>
					<h3 melt={$title(id)} class="flex items-center gap-2 font-semibold">
						{data.title}
						<span class="rounded-full square-1.5 {data.color}" />
					</h3>
					<div melt={$description(id)}>
						{data.description}
					</div>
				</div>
				<button
					melt={$close(id)}
					class="absolute right-4 top-4 grid place-items-center rounded-full text-magnum-500 square-6
					hover:bg-magnum-900/50"
				>
					<X />
				</button>
			</div>
		</div>
	{/each}
</div>
