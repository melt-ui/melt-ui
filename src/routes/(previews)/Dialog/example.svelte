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
		class="text-violet-800 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center
    justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px]
    focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
	>
		Open Dialog
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
		<Dialog.Content
			class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] 
			translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] 
			shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
		>
			<Dialog.Title class="text-black m-0 text-lg font-medium">Edit profile</Dialog.Title>
			<Dialog.Description class="text-slate-500 mt-[10px] mb-5 text-[15px] leading-normal">
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>

			<fieldset class="mb-4 flex items-center gap-5">
				<label class="text-violet-800 w-[90px] text-right text-[15px]" for="name"> Name </label>
				<input
					class="text-violet-800 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
					id="name"
					value="Thomas G. Lopes"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex items-center gap-5">
				<label class="text-violet-900/75 w-[90px] text-right text-[15px]" for="username">
					Username
				</label>
				<input
					class="text-violet-800 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
					id="username"
					value="@thomasglopes"
				/>
			</fieldset>
			<div class="mt-[25px] flex justify-end gap-4">
				<Dialog.Close
					class="bg-slate-100 text-slate-600 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center
				rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
				>
					Cancel
				</Dialog.Close>
				<Dialog.Close
					class="bg-green-100 text-green-600 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center
				rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
				>
					Save changes
				</Dialog.Close>
			</div>

			<Dialog.Close
				class="text-violet-800 hover:bg-violet-100 focus:shadow-violet-400 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none
			items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
				aria-label="Close"
			>
				<Cross2Icon />
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
