<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';
	/** Internal helpers */
	import { flyAndScale } from '$docs/utils';
	import X from '~icons/lucide/x';

	const { trigger, portal, overlay, content, title, description, close, open } =
		createDialog();

	const {
		trigger: triggerNested,
		portal: portalNested,
		overlay: overlayNested,
		content: contentNested,
		title: titleNested,
		description: descriptionNested,
		close: closeNested,
		open: openNested,
	} = createDialog();
</script>

<button
	melt={$trigger}
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
    font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75"
>
	Open Dialog
</button>
<div use:portal>
	{#if $open}
		<div melt={$overlay} class="fixed inset-0 z-40 bg-black/50" />
		<div
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
            max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
            p-6 shadow-lg"
			transition:flyAndScale={{
				duration: 150,
				y: 8,
				start: 0.96,
			}}
			melt={$content}
		>
			<h2 melt={$title} class="m-0 text-lg font-medium text-black">
				First dialog
			</h2>
			<p melt={$description} class="mb-5 mt-2 leading-normal text-zinc-600">
				This is the first dialog. It contains a trigger to open a second dialog.
			</p>

			<div class="mt-6 flex justify-end gap-4">
				<button
					melt={$close}
					class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
				>
					Cancel
				</button>
				<button
					melt={$triggerNested}
					class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
				>
					Open second
				</button>
			</div>

			<button
				melt={$close}
				class="absolute right-[10px] top-[10px] inline-flex h-6 w-6
                appearance-none items-center justify-center rounded-full text-magnum-800
                hover:bg-magnum-100 focus:shadow-magnum-400"
			>
				<X />
			</button>
		</div>
	{/if}
</div>

<div use:portalNested>
	{#if $openNested}
		<div melt={$overlayNested} class="fixed inset-0 z-40 bg-black/75" />
		<div
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
            max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
            p-6 shadow-2xl"
			transition:flyAndScale={{
				duration: 150,
				y: 8,
				start: 0.96,
			}}
			melt={$contentNested}
		>
			<h2 melt={$titleNested} class="m-0 text-lg font-medium text-black">
				Second dialog
			</h2>
			<p
				melt={$descriptionNested}
				class="mb-5 mt-2 leading-normal text-zinc-600"
			>
				This is the second dialog.
			</p>

			<div class="mt-6 flex justify-end gap-4">
				<button
					melt={$closeNested}
					class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
				>
					Close
				</button>
			</div>

			<button
				melt={$closeNested}
				class="absolute right-[10px] top-[10px] inline-flex h-6 w-6
                appearance-none items-center justify-center rounded-full text-magnum-800
                hover:bg-magnum-100 focus:shadow-magnum-400"
			>
				<X />
			</button>
		</div>
	{/if}
</div>
