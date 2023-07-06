<script lang="ts">
	import { createPopover, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import Settings2 from '~icons/lucide/settings2';
	import X from '~icons/lucide/x';

	const { trigger, content, open, arrow, close } = createPopover();
</script>

<button type="button" class="trigger" use:melt={$trigger} aria-label="Update dimensions">
	<Settings2 class="h-4 w-4" />
	<span class="sr-only">Open Popover</span>
</button>

{#if $open}
	<div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
		<div {...$arrow} />
		<div class="flex flex-col gap-2.5">
			<p>Dimensions</p>
			<fieldset>
				<label for="width"> Width </label>
				<input id="width" value="100%" class="input" />
			</fieldset>
			<fieldset>
				<label for="maxWidth"> Max. width </label>
				<input id="maxWidth" value="300px" class="input" />
			</fieldset>
			<fieldset>
				<label for="height"> Height </label>
				<input id="height" value="25px" class="input" />
			</fieldset>
			<fieldset>
				<label for="maxHeight"> Max. height </label>
				<input id="maxHeight" class="input" />
			</fieldset>
		</div>
		<button class="close" use:melt={$close}>
			<X class="h-4 w-4 " />
		</button>
	</div>
{/if}

<style lang="postcss">
	fieldset {
		@apply flex items-center gap-5;
	}

	label {
		@apply w-[75px] text-sm text-neutral-700;
	}

	p {
		@apply mb-2 font-medium text-neutral-900;
	}

	.input {
		@apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
		@apply ring-offset-magnum-300 focus-visible:ring;
		@apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
		@apply flex-1 items-center justify-center;
		@apply px-2.5 text-sm leading-none text-magnum-700;
	}

	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.close {
		@apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply bg-white p-0 text-sm font-medium;
	}

	.content {
		@apply z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm;
	}
</style>
