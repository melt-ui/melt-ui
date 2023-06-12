<script lang="ts">
	import { createPopover } from '@melt-ui/svelte';
	import { Docs } from '$routes/(components)';
	import { fade } from 'svelte/transition';
	import Settings2 from '~icons/lucide/settings2';
	import X from '~icons/lucide/x';

	const { trigger, content, open, arrow } = createPopover();
</script>

<Docs.PreviewWrapper>
	<button type="button" class="PopoverTrigger" {...$trigger()} aria-label="Update dimensions">
		<Settings2 class="h-4 w-4" />
		<span class="sr-only">Open Popover</span>
	</button>

	{#if $open}
		<div {...$content} transition:fade|local={{ duration: 100 }} class="PopoverContent">
			<div {...$arrow} />
			<div class="flex flex-col gap-2.5">
				<p>Dimensions</p>
				<fieldset>
					<label for="width"> Width </label>
					<input id="width" value="100%" class="PopoverInput" />
				</fieldset>
				<fieldset>
					<label for="maxWidth"> Max. width </label>
					<input id="maxWidth" value="300px" class="PopoverInput" />
				</fieldset>
				<fieldset>
					<label for="height"> Height </label>
					<input id="height" value="25px" class="PopoverInput" />
				</fieldset>
				<fieldset>
					<label for="maxHeight"> Max. height </label>
					<input id="maxHeight" class="PopoverInput" />
				</fieldset>
			</div>
			<button class="PopoverClose">
				<X class="h-6 w-6" />
			</button>
		</div>
	{/if}
</Docs.PreviewWrapper>

<style>
	fieldset {
		@apply flex items-center gap-5;
	}

	label {
		@apply w-[75px] text-sm text-neutral-700;
	}

	p {
		@apply mb-2 font-medium text-neutral-900;
	}

	.PopoverInput {
		@apply flex h-8 w-full flex-1 items-center justify-center rounded-md border border-magnum-500 bg-transparent px-2.5 text-sm  leading-none text-magnum-700 ring-offset-magnum-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
	}

	.PopoverTrigger {
		@apply inline-flex h-10 w-10 items-center justify-center rounded-full bg-white p-0 text-sm font-medium  text-neutral-900 ring-neutral-800/50 transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2;
	}

	.PopoverClose {
		@apply inline-flex h-10 w-10 items-center justify-center rounded-full bg-white p-0 text-sm font-medium  text-neutral-900 ring-white/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2;
	}

	.PopoverContent {
		@apply z-10 w-64 rounded-md bg-white p-5 shadow-sm;
	}
</style>
