<script lang="ts">
	import { AlertDialog } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.

	export let propsObj: ResolvedProps<typeof AlertDialog>;
</script>

<AlertDialog.Root bind:open={propsObj.Root.open}>
	<AlertDialog.Trigger
		class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
    font-medium leading-none text-vermilion-800 shadow-lg hover:opacity-75
    focus:outline-none focus:ring focus:ring-black"
	>
		Delete account
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
		<AlertDialog.Content
			class="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] 
			translate-y-[-50%] rounded-md bg-white p-[25px] shadow-lg
			focus:outline-none data-[state=open]:animate-contentShow"
		>
			<AlertDialog.Title class="m-0 text-lg font-medium text-black"
				>Are you absolutely sure?</AlertDialog.Title
			>
			<AlertDialog.Description class="mb-5 mt-[10px] leading-normal text-zinc-600">
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</AlertDialog.Description>

			<div class="mt-[25px] flex justify-end gap-4">
				<AlertDialog.Cancel
					class="hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100
				px-4 font-medium leading-none text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black"
				>
					Cancel
				</AlertDialog.Cancel>
				<AlertDialog.Action
					class="hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100
				px-4 font-medium leading-none text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black"
				>
					Yes, delete account
				</AlertDialog.Action>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
