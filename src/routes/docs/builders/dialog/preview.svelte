<script lang="ts">
	import { createDialog } from '$lib/builders/dialog';
	import { Docs } from '$routes/(components)';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';

	const { selectedText, trigger, menu, option, isSelected } = createDialog();

	const options = {
		fruits: ['Apple', 'Banana', 'Orange', 'Pineapple'],
		vegetables: ['Broccoli', 'Carrot', 'Potato', 'Tomato'],
	};
</script>

<Docs.PreviewWrapper>
	<div>
		<button
			{...$trigger}
			class="text-vermilion-800 inline-flex items-center justify-center rounded-md bg-white px-4
			py-2 font-medium leading-none shadow-lg hover:opacity-75
			focus:outline-none focus:ring focus:ring-black"
		>
			Open Dialog
		</button>
		<!-- <Dialog.Portal>
			<Dialog.Overlay class="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
			<Dialog.Content
				class="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] 
				translate-y-[-50%] rounded-md bg-white p-[25px] shadow-lg
				focus:outline-none data-[state=open]:animate-contentShow"
				openAutoFocus={contentOpenAutoFocus}
				closeAutoFocus={contentCloseAutoFocus}
			>
				<Dialog.Title class="m-0 text-lg font-medium text-black">Edit profile</Dialog.Title>
				<Dialog.Description class="mb-5 mt-[10px] leading-normal text-zinc-600">
					Make changes to your profile here. Click save when you're done.
				</Dialog.Description>

				<fieldset class="mb-4 flex items-center gap-5">
					<label class="text-vermilion-800 w-[90px] text-right" for="name"> Name </label>
					<input
						class="text-vermilion-800 focus:ring-vermilion-800 inline-flex h-8 w-full flex-1 items-center justify-center
						rounded-sm border border-solid px-3 leading-none outline-none focus:ring-2"
						id="name"
						value="Thomas G. Lopes"
					/>
				</fieldset>
				<fieldset class="mb-4 flex items-center gap-5">
					<label class="text-vermilion-800 w-[90px] text-right" for="username"> Username </label>
					<input
						class="text-vermilion-800 focus:ring-vermilion-800 inline-flex h-8 w-full flex-1 items-center justify-center
						rounded-sm border border-solid px-3 leading-none outline-none focus:ring-2"
						id="username"
						value="@thomasglopes"
					/>
				</fieldset>
				<div class="mt-[25px] flex justify-end gap-4">
					<Dialog.Close
						class="hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100
					px-4 font-medium leading-none text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black"
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
					class="text-vermilion-800 hover:bg-vermilion-100 focus:shadow-vermilion-400 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none
				items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-black"
					aria-label="Close"
				>
					<X />
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal> -->
	</div>
</Docs.PreviewWrapper>

<style lang="postcss">
	.label {
		@apply py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800;
	}
	.menu {
		@apply z-10 flex max-h-[300px] flex-col gap-2 overflow-y-auto;
		@apply rounded-md bg-white p-1 lg:max-h-none;
	}
	.option {
		@apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800;
		@apply outline-none hocus:bg-magnum-100 hocus:text-magnum-700;
	}
	.trigger {
		@apply flex h-10 w-[180px] items-center justify-between rounded-md bg-white px-3;
		@apply py-2 text-magnum-700 outline-none hover:opacity-75 focus:ring focus:ring-magnum-400;
	}
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
