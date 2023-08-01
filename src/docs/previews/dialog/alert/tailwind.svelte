<script lang="ts">
	import { createDialog, melt } from '$lib';
	/** Internal helpers */
	import { flyAndScale } from '$docs/utils';
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
	} = createDialog({
		role: 'alertdialog',
	});
</script>

<button
	use:melt={$trigger}
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
    font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75"
>
	Delete Item
</button>

<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
		<div
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
            max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
            p-6 shadow-lg"
			transition:flyAndScale={{
				duration: 150,
				y: 8,
				start: 0.96,
			}}
			use:melt={$content}
		>
			<h2 use:melt={$title} class="m-0 text-lg font-medium text-black">
				Are you sure you want to delete this?
			</h2>
			<p use:melt={$description} class="mb-5 mt-2 leading-normal text-zinc-600">
				This action cannot be undone. This will permanently delete the item and
				remove it from our servers.
			</p>

			<div class="mt-6 flex justify-end gap-4">
				<button
					use:melt={$close}
					class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
				>
					Cancel
				</button>
				<button
					use:melt={$close}
					class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
				>
					Continue
				</button>
			</div>

			<button
				use:melt={$close}
				aria-label="Close"
				class="absolute right-[10px] top-[10px] inline-flex h-6 w-6
                appearance-none items-center justify-center rounded-full text-magnum-800
                hover:bg-magnum-100 focus:shadow-magnum-400"
			>
				<X class="square-4" />
			</button>
		</div>
	{/if}
</div>
