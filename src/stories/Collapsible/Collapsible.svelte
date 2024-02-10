<script lang="ts">
	import PreviewWrapper from '$docs/components/preview-wrapper.svelte';
	import { createCollapsible, melt, type CreateCollapsibleProps } from '$lib/index.js';
	import { ChevronsUpDown, X } from '$icons/index.js';

	export let open: CreateCollapsibleProps['open'] = undefined;
	export let disabled: CreateCollapsibleProps['disabled'] = false;

	const {
		elements: { root, content, trigger },
		states: { open: localOpen },
	} = createCollapsible({
		open,
		disabled,
	});
</script>

<main>
	<PreviewWrapper>
		<div use:melt={$root} class="mx-auto w-screen max-w-md">
			<div class="flex items-center justify-between">
				<span class="text-sm leading-6 text-white"> @thomasglopes starred 3 repositories </span>
				<button
					use:melt={$trigger}
					class="relative h-6 w-6 place-items-center rounded-full bg-white text-sm text-magnum-700
				shadow-lg hover:opacity-75
				data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75"
					aria-label={localOpen ? 'Close' : 'Open'}
					data-testid="trigger"
				>
					<div class="abs-center" aria-hidden="true">
						{#if $localOpen}
							<X class="size-4" />
						{:else}
							<ChevronsUpDown class="size-4" />
						{/if}
					</div>
				</button>
			</div>

			<div class="my-2 rounded bg-white p-3 shadow-lg">
				<span class="text-base leading-6 text-magnum-800">melt-ui/melt-ui</span>
			</div>

			<div use:melt={$content} data-testid="content">
				<div class="flex flex-col gap-2">
					<div class="rounded bg-white p-3 shadow-lg">
						<span class="text-base leading-6 text-magnum-800">sveltejs/svelte</span>
					</div>
					<div class="rounded bg-white p-3 shadow-lg">
						<span class="text-base leading-6 text-magnum-800">sveltejs/kit</span>
					</div>
				</div>
			</div>
		</div>
	</PreviewWrapper>
</main>

<style>
	.abs-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
