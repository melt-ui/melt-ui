<script lang="ts">
	import { melt } from '$lib/index.js';
	/** Internal helpers */
	import { PreviewWrapper } from '$docs/components/index.js';
	import BaseDialog from './BaseDialog.svelte';
</script>

<PreviewWrapper>
	<BaseDialog let:trigger>
		<button
			use:melt={trigger}
			class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
			font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75
			"
		>
			Open First
		</button>
		<svelte:fragment slot="content" let:title let:description let:close>
			<h2 use:melt={title} class="m-0 text-lg font-medium text-black">First Dialog</h2>
			<p use:melt={description} class="mb-5 mt-2 leading-normal text-zinc-600">
				Open the second dialog from here.
			</p>

			<div class="flex items-center justify-end gap-4">
				<button
					use:melt={close}
					class="inline-flex h-8 items-center justify-center rounded-[4px] bg-neutral-100
      px-4 font-medium leading-none text-neutral-900"
				>
					Close
				</button>
				<BaseDialog let:trigger={secondTrigger}>
					<button
						use:melt={secondTrigger}
						class="inline-flex h-8 items-center justify-center rounded-[4px] bg-magnum-100
					px-4 font-medium leading-none text-magnum-900"
					>
						Open nested
					</button>
					<svelte:fragment
						slot="content"
						let:title={secondTitle}
						let:description={secondDescription}
						let:close={secondClose}
					>
						<h2 use:melt={secondTitle} class="m-0 text-lg font-medium text-black">Second Dialog</h2>
						<p use:melt={secondDescription} class="mb-5 mt-2 leading-normal text-zinc-600">Cool!</p>

						<div class="flex items-center justify-end gap-4">
							<button
								use:melt={secondClose}
								class="inline-flex h-8 items-center justify-center rounded-[4px] bg-neutral-100
						px-4 font-medium leading-none text-neutral-900"
							>
								Close
							</button>
						</div>
					</svelte:fragment>
				</BaseDialog>
			</div>
		</svelte:fragment>
	</BaseDialog>
</PreviewWrapper>
