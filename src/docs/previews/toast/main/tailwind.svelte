<script lang="ts">
	import { createToast } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { trigger, open, content, title, description, close } = createToast();

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
	melt={$trigger}
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75"
	on:click={() => (eventDate = oneWeekAway())}
>
	Add to calendar
</button>
{#if $open}
	<div
		melt={$content}
		in:slide={{ duration: 100 }}
		out:slide={{ duration: 200, axis: 'x' }}
		class="fixed bottom-0 right-0 m-4 z-50 rounded-md bg-white shadow-md"
	>
		<div
			class="w-[380px] flex items-center justify-between rounded-md bg-white p-5"
		>
			<div>
				<h3 melt={$title} class="font-semibold text-black">
					Scheduled: Catch up
				</h3>
				<time
					melt={$description}
					class="text-zinc-600"
					datetime={eventDate.toISOString()}
				>
					{prettyDate(eventDate)}
				</time>
			</div>
			<button
				melt={$close}
				class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
			>
				Undo
			</button>
		</div>
	</div>
{/if}
