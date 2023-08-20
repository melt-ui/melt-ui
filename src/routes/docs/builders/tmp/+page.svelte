<script lang="ts">
	import { fly } from 'svelte/transition';
	import * as Dialog from './(bits-ui)/bits/dialog/index.js';
	import { X } from 'lucide-svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium
    leading-none text-magnum-700 shadow-lg hover:opacity-75 focus:outline-none focus:ring
    focus:ring-magnum-400">Open sesame</Dialog.Trigger
	>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
		<Dialog.Content
			class="fixed left-0 top-0 z-50 h-screen w-full max-w-[350px] bg-white p-6
		shadow-lg focus:outline-none"
			transition={fly}
			transitionConfig={{ x: -350, duration: 300, opacity: 1 }}
		>
			<Dialog.Close
				class="absolute right-[10px] top-[10px] inline-flex h-6 w-6
			appearance-none items-center justify-center rounded-full text-magnum-800
			hover:bg-magnum-100 focus:shadow-magnum-400 focus:outline-none focus:ring-2
			focus:ring-magnum-400"
			>
				<X class="square-4" />
			</Dialog.Close>
			<Dialog.Title class="mb-0 text-lg font-medium text-black">Notifications</Dialog.Title>
			<Dialog.Description class="mb-5 mt-2 leading-normal text-zinc-600">
				Check out your latest updates.
			</Dialog.Description>
			<section>
				<div class="rounded-md bg-gray-100/80 p-4 text-zinc-800 shadow">
					<h3 class="mb-3 text-base font-semibold">New invitation</h3>
					<p class="text-sm">
						You have been invited to join the <strong>Designers</strong> team.
					</p>
					<div class="mt-6 flex justify-end gap-4">
						<button
							class="inline-flex h-8 items-center justify-center
                            rounded-[4px] bg-zinc-100 px-4 font-medium leading-none
                            text-zinc-600 focus:outline-none focus:ring-2
                            focus:ring-magnum-400"
						>
							Reject
						</button>
						<button
							class="inline-flex h-8 items-center justify-center
                            rounded-[4px] bg-magnum-100 px-4 font-medium leading-none
                            text-magnum-900 focus:outline-none focus:ring-2
                            focus:ring-magnum-400"
						>
							Accept
						</button>
					</div>
				</div>
			</section>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
