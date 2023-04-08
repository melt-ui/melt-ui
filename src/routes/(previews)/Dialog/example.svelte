<!-- React -->
<!-- import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

const DialogDemo = () => (
  <Dialog.Root>
    <Dialog.Trigger >
      <button class="text-violet-800 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
        Edit profile
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title class="text-mauve12 m-0 text-[17px] font-medium">
          Edit profile
        </Dialog.Title>
        <Dialog.Description class="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
          Make changes to your profile here. Click save when you're done.
        </Dialog.Description>
        <fieldset class="mb-[15px] flex items-center gap-5">
          <label class="text-violet-800 w-[90px] text-right text-[15px]" for="name">
            Name
          </label>
          <input
            class="text-violet-800 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="name"
            value="Pedro Duarte"
          />
        </fieldset>
        <fieldset class="mb-[15px] flex items-center gap-5">
          <label class="text-violet-800 w-[90px] text-right text-[15px]" for="username">
            Username
          </label>
          <input
            class="text-violet-800 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="username"
            value="@peduarte"
          />
        </fieldset>
        <div class="mt-[25px] flex justify-end">
          <Dialog.Close >
            <button class="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
              Save changes
            </button>
          </Dialog.Close>
        </div>
        <Dialog.Close >
          <button
            class="text-violet-800 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DialogDemo; -->

<!-- Svelte -->
<script lang="ts">
	import { Dialog } from '$lib';
	import type { ResolvedProps } from '../helpers';
	import Cross2Icon from '~icons/radix-icons/cross-2';

	export let propsObj: ResolvedProps<typeof Dialog>;
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="text-violet-800 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center
    justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px]
    focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
	>
		Edit profile
	</Dialog.Trigger>
	<Dialog.Portal>
		<!-- <Dialog.Overlay class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" /> -->
		<Dialog.Content
			class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
		>
			<!-- <Dialog.Title class="text-mauve12 m-0 text-[17px] font-medium">Edit profile</Dialog.Title>
			<Dialog.Description class="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description> -->
			<fieldset class="mb-[15px] flex items-center gap-5">
				<label class="text-violet-800 w-[90px] text-right text-[15px]" for="name"> Name </label>
				<input
					class="text-violet-800 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
					id="name"
					value="Pedro Duarte"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex items-center gap-5">
				<label class="text-violet-800 w-[90px] text-right text-[15px]" for="username">
					Username
				</label>
				<input
					class="text-violet-800 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
					id="username"
					value="@peduarte"
				/>
			</fieldset>
			<div class="mt-[25px] flex justify-end">
				<Dialog.Close>
					<button
						class="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
					>
						Save changes
					</button>
				</Dialog.Close>
			</div>
			<Dialog.Close>
				<button
					class="text-violet-800 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
					aria-label="Close"
				>
					<Cross2Icon />
				</button>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
