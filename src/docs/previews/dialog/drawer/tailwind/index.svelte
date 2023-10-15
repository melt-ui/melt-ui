<script lang="ts">
	import { createDialog, melt } from '$lib/index.js';
	import { fade, fly } from 'svelte/transition';
	// Internal helpers
	import { X } from 'lucide-svelte';

	const {
		elements: {
			trigger,
			overlay,
			content,
			title,
			description,
			close,
			portalled,
		},
		states: { open },
	} = createDialog();
</script>

<button
	use:melt={$trigger}
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium
    leading-none text-magnum-700 shadow-lg hover:opacity-75 focus:outline-none focus:ring
    focus:ring-magnum-400"
>
	View Notifications
</button>
<div use:melt={$portalled}>
	{#if $open}
		<div
			use:melt={$overlay}
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 350 }}
		/>
		<div
			use:melt={$content}
			class="fixed left-0 top-0 z-50 h-screen w-full max-w-[350px] bg-white p-6
            shadow-lg focus:outline-none"
			transition:fly={{
				x: -350,
				duration: 300,
				opacity: 1,
			}}
		>
			<button
				use:melt={$close}
				aria-label="Close"
				class="absolute right-[10px] top-[10px] inline-flex h-6 w-6
                appearance-none items-center justify-center rounded-full text-magnum-800
                hover:bg-magnum-100 focus:shadow-magnum-400 focus:outline-none focus:ring-2
                focus:ring-magnum-400"
			>
				<X class="square-4" />
			</button>
			<h2 use:melt={$title} class="mb-0 text-lg font-medium text-black">
				Notifications
			</h2>
			<p use:melt={$description} class="mb-5 mt-2 leading-normal text-zinc-600">
				Check out your latest updates.
			</p>
			<section>
				<div class="rounded-md bg-gray-100/80 p-4 text-zinc-800 shadow">
					<h3 class="mb-3 text-base font-semibold">New invitation</h3>
					<p class="text-sm">
						You have been invited to join the <strong>Designers</strong> team.
					</p>
					<div class="mt-6 flex justify-end gap-4">
						<button
							class="inline-flex h-8 items-center justify-center
                            rounded-[4px] bg-zinc-100 px-4 font-medium leading-none
                            text-zinc-600 focus:outline-none focus:ring-2
                            focus:ring-magnum-400"
						>
							Reject
						</button>
						<button
							class="inline-flex h-8 items-center justify-center
                            rounded-[4px] bg-magnum-100 px-4 font-medium leading-none
                            text-magnum-900 focus:outline-none focus:ring-2
                            focus:ring-magnum-400"
						>
							Accept
						</button>
					</div>
				</div>
			</section>
		</div>
	{/if}
</div>
