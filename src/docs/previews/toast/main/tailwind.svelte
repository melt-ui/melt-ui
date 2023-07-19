<script lang="ts">
	import { createToast } from '@melt-ui/svelte';
	import clsx from 'clsx';
	import { slide } from 'svelte/transition';

	type ToastData = {
		title: string;
		description: string;
		color: string;
	};

	const { toasts, addToast, content, title, description, close } =
		createToast<ToastData>();

	const toastData: ToastData[] = [
		{
			title: 'Success',
			description: 'Congratulations! It worked!',
			color: 'bg-green-600',
		},
		{
			title: 'Warning',
			description: 'Please check again.',
			color: 'bg-orange-600',
		},
		{
			title: 'Error',
			description: 'Something did not work!',
			color: 'bg-red-600',
		},
	];

	function addRandomToast() {
		addToast({ data: toastData[Math.floor(Math.random() * toastData.length)] });
	}
</script>

<button
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75"
	on:click={addRandomToast}
>
	Show toast
</button>

<div class="fixed bottom-0 right-0 m-4 z-50 flex flex-col items-end gap-2">
	{#each $toasts.values() as { id, open, data }}
		{#if open}
			<div
				melt={$content(id)}
				in:slide|global={{ duration: 100 }}
				out:slide|global={{ duration: 200, axis: 'x' }}
				class={clsx('rounded-md shadow-md', data.color)}
			>
				<div class="w-[380px] flex items-center justify-between rounded-md p-5">
					<div>
						<h3 melt={$title(id)} class="font-semibold text-white">
							{data.title}
						</h3>
						<div melt={$description(id)} class="text-zinc-white">
							{data.description}
						</div>
					</div>
					<button
						melt={$close(id)}
						class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100 px-4 font-medium leading-none text-zinc-600 hover:opacity-75"
					>
						Dismiss
					</button>
				</div>
			</div>
		{/if}
	{/each}
</div>
