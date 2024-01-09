<script lang="ts">
	import { melt } from '$lib/index.js';
	/** Internal helpers */
	import { PreviewWrapper } from '$docs/components/index.js';
	import BaseDialog from './BaseDialog.svelte';
	import Select from './Select.svelte';
</script>

<PreviewWrapper>
	<BaseDialog let:trigger>
		<button
			use:melt={trigger}
			class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
		font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75
		"
		>
			Open Dialog
		</button>
		<svelte:fragment slot="content" let:title let:description let:close>
			<h2 use:melt={title} class="m-0 text-lg font-medium text-black">Dialog</h2>
			<p use:melt={description} class="mb-5 mt-2 leading-normal text-zinc-600">
				This dialog should contain a select element.
			</p>

			<Select />

			<div class="flex items-center justify-end gap-4">
				<button
					use:melt={close}
					class="inline-flex h-8 items-center justify-center rounded-[4px] bg-neutral-100
      px-4 font-medium leading-none text-neutral-900"
				>
					Close
				</button>
			</div>
		</svelte:fragment>
	</BaseDialog>
</PreviewWrapper>
