<script lang="ts">
	import { Dialog } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import Cross2Icon from '~icons/radix-icons/cross-2';

	export let propsObj: ResolvedProps<typeof Dialog>;
</script>

<Dialog.Root
	bind:open={propsObj.Root.open}
	bind:modal={propsObj.Root.modal}
	openAutoFocus={propsObj.Root.openAutoFocus}
	closeAutoFocus={propsObj.Root.closeAutoFocus}
>
	<Dialog.Trigger
		class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
    font-medium leading-none text-vermilion-800 shadow-lg hover:opacity-75
    focus:outline-none focus:ring focus:ring-black"
	>
		Open Dialog
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
		<Dialog.Content
			class="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] 
			translate-y-[-50%] rounded-md bg-white p-[25px] shadow-lg
			focus:outline-none data-[state=open]:animate-contentShow"
		>
			<Dialog.Title class="m-0 text-lg font-medium text-black">Edit profile</Dialog.Title>
			<Dialog.Description class="mb-5 mt-[10px] leading-normal text-neutral-600">
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>

			<fieldset class="mb-4 flex items-center gap-5">
				<label class="w-[90px] text-right text-vermilion-800" for="name"> Name </label>
				<input
					class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border
					border-solid px-3 leading-none text-vermilion-800 outline-none focus:ring-2 focus:ring-vermilion-800"
					id="name"
					value="Thomas G. Lopes"
				/>
			</fieldset>
			<fieldset class="mb-4 flex items-center gap-5">
				<label class="w-[90px] text-right text-vermilion-800" for="username"> Username </label>
				<input
					class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border
					border-solid px-3 leading-none text-vermilion-800 outline-none focus:ring-2 focus:ring-vermilion-800"
					id="username"
					value="@thomasglopes"
				/>
			</fieldset>
			<div class="mt-[25px] flex justify-end gap-4">
				<Dialog.Close
					class="hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-neutral-100
				px-4 font-medium leading-none text-neutral-600 focus:outline-none focus:ring-2 focus:ring-black"
				>
					Cancel
				</Dialog.Close>
				<Dialog.Close
					class="hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-green-100
				px-4 font-medium leading-none text-green-900 focus:outline-none focus:ring-2 focus:ring-black"
				>
					Save changes
				</Dialog.Close>
			</div>

			<Dialog.Close
				class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full
			text-vermilion-800 hover:bg-vermilion-100 focus:shadow-vermilion-400 focus:outline-none focus:ring-2 focus:ring-black"
				aria-label="Close"
			>
				<Cross2Icon />
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
