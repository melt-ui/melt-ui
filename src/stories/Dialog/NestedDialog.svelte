<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';
	/** Internal helpers */
	import { PreviewWrapper } from '$docs/components';
	import BaseDialog from './BaseDialog.svelte';

	const dialog = createDialog();
	const {
		elements: { trigger },
	} = dialog;

	const secondDialog = createDialog();
	const {
		elements: { trigger: secondTrigger },
	} = secondDialog;
</script>

<PreviewWrapper>
	<button
		melt={$trigger}
		class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
		font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75
		"
	>
		Open First
	</button>

	<BaseDialog {dialog} let:title let:description let:close>
		<h2 melt={title} class="m-0 text-lg font-medium text-black">First Dialog</h2>
		<p melt={description} class="mb-5 mt-2 leading-normal text-zinc-600">
			Open the second dialog from here.
		</p>

		<div class="flex items-center justify-end gap-4">
			<button
				melt={close}
				class="inline-flex h-8 items-center justify-center rounded-[4px] bg-neutral-100
      px-4 font-medium leading-none text-neutral-900"
			>
				Close
			</button>
			<button
				melt={$secondTrigger}
				class="inline-flex h-8 items-center justify-center rounded-[4px] bg-magnum-100
    px-4 font-medium leading-none text-magnum-900"
			>
				Open nested
			</button>
		</div>
	</BaseDialog>

	<BaseDialog dialog={secondDialog} let:title let:description let:close>
		<h2 melt={title} class="m-0 text-lg font-medium text-black">Second Dialog</h2>
		<p melt={description} class="mb-5 mt-2 leading-normal text-zinc-600">Cool!</p>

		<div class="flex items-center justify-end gap-4">
			<button
				melt={close}
				class="inline-flex h-8 items-center justify-center rounded-[4px] bg-neutral-100
      px-4 font-medium leading-none text-neutral-900"
			>
				Close
			</button>
		</div>
	</BaseDialog>
</PreviewWrapper>
