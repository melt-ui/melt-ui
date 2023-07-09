<script lang="ts">
	import { createCollapsible } from '$lib/builders/collapsible';
	import PreviewWrapper from '$docs/components/preview-wrapper.svelte';
	import { slide } from 'svelte/transition';

	let openProp: boolean;
	let disabledProp: boolean;
	export { openProp as open, disabledProp as disabled };

	const { open, root, content, trigger, disabled } = createCollapsible({
		open: openProp,
		disabled: disabledProp,
	});

	$: $open = openProp;
	$: $disabled = disabledProp;
</script>

<PreviewWrapper>
	<div {...$root} class="w-screen max-w-md">
		<div class="flex items-center justify-between">
			<span class="text-sm leading-6 text-white"> @thomasglopes starred 3 repositories </span>
			<button
				{...$trigger}
				use:trigger
				class="rounded-sm bg-white px-2 py-1 text-sm text-magnum-700
			shadow-lg hover:opacity-75
			data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75"
			>
				toggle
			</button>
		</div>

		<div class="my-2 rounded bg-white p-3 shadow-lg">
			<span class="text-base leading-[25px] text-magnum-800">melt-ui/melt-ui</span>
		</div>

		{#if $open}
			<div {...$content} transition:slide>
				<div class="flex flex-col gap-2">
					<div class="rounded bg-white p-3 shadow-lg">
						<span class="text-base leading-[25px] text-magnum-800">sveltejs/svelte</span>
					</div>
					<div class="rounded bg-white p-3 shadow-lg">
						<span class="text-base leading-[25px] text-magnum-800">sveltejs/kit</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</PreviewWrapper>

<style>
	.abs-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
