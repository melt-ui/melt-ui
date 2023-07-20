<script lang="ts">
	import { createToasts } from '@melt-ui/svelte';
	import { cn } from '$docs/utils';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	type ToastData = {
		title: string;
		description: string;
		color: string;
	};

	const { toasts, addToast, content, title, description, close } =
		createToasts<ToastData>({});

	const toastData: ToastData[] = [
		{
			title: 'Success',
			description: 'Congratulations! It worked!',
			color: 'border-green-500',
		},
		{
			title: 'Warning',
			description: 'Please check again.',
			color: 'border-orange-500',
		},
		{
			title: 'Error',
			description: 'Something did not work!',
			color: 'border-red-500',
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

<div class="fixed bottom-0 right-0 z-50 m-4 flex flex-col items-end gap-2">
	{#each $toasts as { id, data } (id)}
		<div
			melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class={cn(
				'rounded-l-lg border-r-2 bg-neutral-800  text-white shadow-md',
				data.color,
			)}
		>
			<div class="rounded- flex w-[380px] items-center justify-between p-5">
				<div>
					<h3 melt={$title(id)} class="font-semibold">
						{data.title}
					</h3>
					<div melt={$description(id)}>
						{data.description}
					</div>
				</div>
				<button
					melt={$close(id)}
					class="inline-flex h-[35px] items-center justify-center rounded-md
					bg-white px-4 font-medium leading-none text-magnum-900 hover:opacity-75"
				>
					Dismiss
				</button>
			</div>
		</div>
	{/each}
</div>
