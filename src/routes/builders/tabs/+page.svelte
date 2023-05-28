<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';
	import Preview from './preview-tw.svelte';
	import twCode from './preview-tw.svelte?raw';
	import scopedCode from './preview-scoped.svelte?raw';
	import theme from 'svelte-highlight/styles/tomorrow-night';
	import { createTabs } from '$lib/builders/tabs/tabs';

	const { rootAttrs, listAttrs, getContentAttrs, getTriggerAttrs } = createTabs({
		value: 'scoped',
	});
</script>

<svelte:head>
	{@html theme}
</svelte:head>

<Preview />

<div class="mx-auto mt-8 max-w-6xl overflow-x-auto rounded-md">
	<div {...rootAttrs}>
		<div class="flex gap-4" {...listAttrs}>
			<div
				class="cursor-pointer opacity-50 hover:opacity-75 data-[state=active]:opacity-100"
				{...$getTriggerAttrs('scoped')}
			>
				Scoped
			</div>
			<div
				class="cursor-pointer opacity-50 hover:opacity-75 data-[state=active]:opacity-100"
				{...$getTriggerAttrs('tailwind')}
			>
				Tailwind
			</div>
		</div>
		<div {...$getContentAttrs('scoped')}>
			<HighlightSvelte code={scopedCode} class=" text-sm" />
		</div>
		<div {...$getContentAttrs('tailwind')}>
			<HighlightSvelte code={twCode} class=" text-sm" />
		</div>
	</div>
</div>
