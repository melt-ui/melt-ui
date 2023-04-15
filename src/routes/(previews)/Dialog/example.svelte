<script lang="ts">
	import { Dialog } from '$lib';
	import type { ResolvedProps } from '../helpers';
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
		class="shadow-lg hover:opacity-75 inline-flex px-4 py-2 items-center justify-center
    rounded-md bg-white font-medium leading-none text-vermilion-800
    focus:ring focus:ring-black focus:outline-none"
	>
		Open Dialog
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
		<Dialog.Content
			class="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] 
			translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg
			focus:outline-none data-[state=open]:animate-contentShow"
		>
			<Dialog.Title class="m-0 text-lg font-medium text-black">Edit profile</Dialog.Title>
			<Dialog.Description class="mb-5 mt-[10px] leading-normal text-slate-500">
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>

			<fieldset class="mb-4 flex items-center gap-5">
				<label class="w-[90px] text-right text-vermilion-800" for="name"> Name </label>
				<input
					class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm px-3
					leading-none text-vermilion-800 border border-solid border-vermilion-200 outline-none focus:shadow-[0_0_0_2px]"
					id="name"
					value="Thomas G. Lopes"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex items-center gap-5">
				<label class="w-[90px] text-right text-vermilion-800" for="username"> Username </label>
				<input
					class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm px-3
				leading-none text-vermilion-800 border border-solid border-vermilion-200 outline-none focus:shadow-[0_0_0_2px]"
					id="username"
					value="@thomasglopes"
				/>
			</fieldset>
			<div class="mt-[25px] flex justify-end gap-4">
				<Dialog.Close
					class="hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-slate-100
				px-[15px] font-medium leading-none text-slate-600 focus:shadow-[0_0_0_2px] focus:outline-none"
				>
					Cancel
				</Dialog.Close>
				<Dialog.Close
					class="hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-green-100
				px-[15px] font-medium leading-none text-green-600 focus:shadow-[0_0_0_2px] focus:outline-none"
				>
					Save changes
				</Dialog.Close>
			</div>

			<Dialog.Close
				class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full
			text-violet-800 hover:bg-violet-100 focus:shadow-[0_0_0_2px] focus:shadow-violet-400 focus:outline-none"
				aria-label="Close"
			>
				<Cross2Icon />
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
