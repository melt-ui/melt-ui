<script lang="ts">
	import { createToast } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { toasts, addToast, isOpen, content, title, description, close } =
		createToast();

	let eventDate = oneWeekAway();

	function oneWeekAway() {
		const now = new Date();
		const inOneWeek = now.setDate(now.getDate() + 7);
		return new Date(inOneWeek);
	}

	function prettyDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			dateStyle: 'full',
			timeStyle: 'short',
		}).format(date);
	}
</script>

<button
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75"
	on:click={() => addToast({})}
>
	Show toast
</button>

<div class="fixed bottom-0 right-0 m-4 z-50 flex flex-col gap-2">
	{#each $toasts as { id }, i}
		{#if $isOpen(id)}
			<div
				melt={$content(id)}
				in:slide={{ duration: 100 }}
				out:slide={{ duration: 200, axis: 'x' }}
				class="rounded-md bg-white shadow-md"
			>
				<div
					class="w-[380px] flex items-center justify-between rounded-md bg-white p-5"
				>
					<div>
						<h3 melt={$title} class="font-semibold text-black">
							Toast {i + 1}
						</h3>
						<div
							melt={$description}
							class="text-zinc-600"
						>
							{prettyDate(eventDate)}
						</div>
					</div>
					<button
						melt={$close(id)}
						class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
					>
						Undo
					</button>
				</div>
			</div>
		{/if}
	{/each}
</div>
