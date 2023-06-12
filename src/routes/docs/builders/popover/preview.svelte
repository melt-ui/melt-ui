<script lang="ts">
	import { createPopover } from '@melt-ui/svelte';
	import { Docs } from '$routes/(components)';
	import { fade } from 'svelte/transition';
	import Settings2 from '~icons/lucide/settings2';

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
		</div>
	{/if}
</Docs.PreviewWrapper>

<style>
	fieldset {
		@apply flex items-center gap-5;
	}

	label {
		@apply w-[75px] text-sm text-magnum-700;
	}

	p {
		@apply mb-2 font-medium text-neutral-900;
	}
</style>
