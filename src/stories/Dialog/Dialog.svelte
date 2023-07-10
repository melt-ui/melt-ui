<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';
	/** Internal helpers */
	import { PreviewWrapper } from '$docs/components';
	import BaseDialog from './BaseDialog.svelte';

	const dialog = createDialog();
	const { trigger, title, description, close } = dialog;
</script>

<PreviewWrapper>
	<button
		{...$trigger}
		use:trigger
		class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
		font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75"
	>
		Open Dialog
	</button>

	<BaseDialog {dialog}>
		<h2 {...$title} class="m-0 text-lg font-medium text-black">Edit profile</h2>
		<p {...$description} class="mb-5 mt-[10px] leading-normal text-zinc-600">
			Make changes to your profile here. Click save when you're done.
		</p>

		<fieldset class="mb-4 flex items-center gap-5">
			<label class="w-[90px] text-right text-magnum-800" for="name"> Name </label>
			<input
				class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border
						border-solid px-3 leading-none text-magnum-800"
				id="name"
				value="Thomas G. Lopes"
			/>
		</fieldset>
		<fieldset class="mb-4 flex items-center gap-5">
			<label class="w-[90px] text-right text-magnum-800" for="username"> Username </label>
			<input
				class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border
						border-solid px-3 leading-none text-magnum-800"
				id="username"
				value="@thomasglopes"
			/>
		</fieldset>
		<div class="mt-[25px] flex justify-end gap-4">
			<button
				{...$close}
				use:close
				class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100
					px-4 font-medium leading-none text-zinc-600"
			>
				Cancel
			</button>
			<button
				{...$close}
				use:close
				class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-magnum-100
					px-4 font-medium leading-none text-magnum-900"
			>
				Save changes
			</button>
		</div>
	</BaseDialog>
</PreviewWrapper>
