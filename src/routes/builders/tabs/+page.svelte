<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';
	import PreviewScoped from './preview-scoped.svelte';
	import scopedCode from './preview-scoped.svelte?raw';
	import PreviewTw from './preview-tw.svelte';
	import twCode from './preview-tw.svelte?raw';
	import PreviewControlled from './preview-controlled.svelte';
	import controlledCode from './preview-controlled.svelte?raw';

	import theme from 'svelte-highlight/styles/tomorrow-night';
	import { createTabs } from '$lib/builders/tabs/tabs';

	const { value, root, list, content, trigger } = createTabs({
		value: 'scoped',
	});
</script>

<svelte:head>
	{@html theme}
</svelte:head>

{#if $value === 'scoped'}
	<PreviewScoped />
{:else if $value === 'tailwind'}
	<PreviewTw />
{:else if $value === 'controlled'}
	<PreviewControlled />
{/if}

<div class="mx-auto mt-8 max-w-6xl overflow-x-auto rounded-md">
	<div {...root}>
		<div class="flex gap-4" {...list}>
			<div
				class="cursor-pointer opacity-50 hover:opacity-75 data-[state=active]:opacity-100"
				{...$trigger('scoped')}
			>
				Scoped
			</div>
			<div
				class="cursor-pointer opacity-50 hover:opacity-75 data-[state=active]:opacity-100"
				{...$trigger('tailwind')}
			>
				Tailwind
			</div>
			<div
				class="cursor-pointer opacity-50 hover:opacity-75 data-[state=active]:opacity-100"
				{...$trigger('controlled')}
			>
				Controlled
			</div>
		</div>
		<div {...$content('scoped')}>
			<HighlightSvelte code={scopedCode} class=" text-sm" />
		</div>
		<div {...$content('tailwind')}>
			<HighlightSvelte code={twCode} class=" text-sm" />
		</div>
		<div {...$content('controlled')}>
			<HighlightSvelte code={controlledCode} class=" text-sm" />
		</div>
	</div>
</div>
