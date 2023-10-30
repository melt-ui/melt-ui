<script lang="ts">
	import { createPopover, melt } from '$lib/index.js';
	import { fade } from 'svelte/transition';
	import { Settings2, X } from 'lucide-svelte';

	const {
		elements: { trigger, content, arrow, close },
		states: { open },
	} = createPopover();

	const {
		elements: {
			trigger: triggerA,
			content: contentA,
			arrow: arrowA,
			close: closeA,
		},
		states: { open: openA },
	} = createPopover({
		positioning: {
			placement: 'left',
		},
	});
</script>

<button
	type="button"
	class="trigger"
	use:melt={$trigger}
	aria-label="Update dimensions"
>
	<Settings2 class="square-4" />
	<span class="sr-only">Open Popover</span>
</button>

{#if $open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class="z-10 rounded-[4px] bg-white p-5 shadow-md"
	>
		<div use:melt={$arrow} />
		<div class="flex flex-col gap-2.5 p-4">
			<button
				type="button"
				class="inline-flex items-center justify-center rounded-md border bg-white px-4 py-2 font-medium leading-none text-magnum-700 shadow-lg transition-colors hover:bg-magnum-100"
				use:melt={$triggerA}
				aria-label="Change settings"
			>
				Open Nested
			</button>

			{#if $openA}
				<div
					use:melt={$contentA}
					transition:fade={{ duration: 100 }}
					class=" z-20 w-64 rounded-md bg-neutral-900 p-5 text-white shadow-lg"
				>
					<div use:melt={$arrowA} />
					<div class="flex flex-col gap-2 px-4 py-2">
						<p class="mb-2 font-medium text-magnum-500">Dimensions</p>
						<fieldset>
							<label for="width" class="w-[75px] text-sm text-magnum-300"
								>Width</label
							>
							<input
								type="number"
								id="width"
								class="input"
								placeholder="Width"
							/>
						</fieldset>
						<fieldset>
							<label for="height" class="w-[75px] text-sm text-magnum-300"
								>Height</label
							>
							<input
								type="number"
								id="height"
								class="input"
								placeholder="Height"
							/>
						</fieldset>
						<fieldset>
							<label for="depth" class="w-[75px] text-sm text-magnum-300"
								>Depth</label
							>
							<input
								type="number"
								id="depth"
								class="input"
								placeholder="Depth"
							/>
						</fieldset>
						<fieldset>
							<label for="weight" class="w-[75px] text-sm text-magnum-300"
								>Weight</label
							>
							<input
								type="number"
								id="weight"
								class="input"
								placeholder="Weight"
							/>
						</fieldset>
					</div>
					<button class="close" use:melt={$closeA}>
						<X class="square-4" />
					</button>
				</div>
			{/if}
		</div>
		<button class="close" use:melt={$close}>
			<X class="square-4" />
		</button>
	</div>
{/if}

<style lang="scss">
	fieldset {
		@apply flex items-center gap-5;
	}

	.input {
		@apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
		@apply ring-offset-magnum-300 focus-visible:ring;
		@apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
		@apply flex-1 items-center justify-center;
		@apply px-2.5 text-sm leading-none text-magnum-700;
	}

	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0;
		@apply text-sm font-medium text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.close {
		@apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply bg-white p-0 text-sm font-medium;
	}
</style>
