<script lang="ts">
	import { createDialog, melt } from '$lib/index.js';
	/** Internal helpers */
	import { flyAndScale } from '$docs/utils/index.js';
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
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
    font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75"
>
	Open Dialog
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
				Edit profile
			</h2>
			<p use:melt={$description} class="mb-5 mt-2 leading-normal text-zinc-600">
				Make changes to your profile here. Click save when you're done.
			</p>

			<fieldset class="mb-4 flex items-center gap-5">
				<label class="w-[90px] text-right text-magnum-800" for="name">
					Name
				</label>
				<input
					class="inline-flex h-8 w-full flex-1 items-center justify-center
                    rounded-sm border border-solid px-3 leading-none text-magnum-800"
					id="name"
					value="Thomas G. Lopes"
				/>
			</fieldset>
			<fieldset class="mb-4 flex items-center gap-5">
				<label class="w-[90px] text-right text-magnum-800" for="username">
					Username
				</label>
				<input
					class="inline-flex h-8 w-full flex-1 items-center justify-center
                    rounded-sm border border-solid px-3 leading-none text-magnum-800"
					id="username"
					value="@thomasglopes"
				/>
			</fieldset>
			<div class="mt-6 flex justify-end gap-4">
				<button
					use:melt={$close}
					class="inline-flex h-8 items-center justify-center rounded-sm
                    bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
				>
					Cancel
				</button>
				<button
					use:melt={$close}
					class="inline-flex h-8 items-center justify-center rounded-sm
                    bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
				>
					Save changes
				</button>
			</div>
			<button
				use:melt={$close}
				aria-label="close"
				class="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none
                items-center justify-center rounded-full p-1 text-magnum-800
                hover:bg-magnum-100 focus:shadow-magnum-400"
			>
				<X class="square-4" />
			</button>
		</div>
	{/if}
</div>
