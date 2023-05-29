<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';
	import PreviewScoped from './preview-scoped.svelte';
	import scopedCode from './preview-scoped.svelte?raw';
	import PreviewTw from './preview-tw.svelte';
	import twCode from './preview-tw.svelte?raw';
	import PreviewControlled from './preview-controlled.svelte';
	import controlledCode from './preview-controlled.svelte?raw';
	import PreviewNoValueArg from './preview-no-value-arg.svelte';
	import noValueArgCode from './preview-no-value-arg.svelte?raw';

	import theme from 'svelte-highlight/styles/tomorrow-night';
	import { createTabs } from '$lib/builders/tabs';

	const { value, root, list, content, trigger } = createTabs({
		value: 'no-value-arg',
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
{:else if $value === 'no-value-arg'}
	<PreviewNoValueArg />
{/if}

<div class="mx-auto mt-8 max-w-6xl overflow-x-auto rounded-md">
	<div {...root}>
		<div class="flex gap-4" {...list}>
			<div
				class="cursor-pointer opacity-50 hover:opacity-75 data-[state=active]:opacity-100"
				{...$trigger({ value: 'scoped' })}
			>
				Scoped
			</div>
			<div
				class="cursor-pointer opacity-50 hover:opacity-75 data-[state=active]:opacity-100"
				{...$trigger({ value: 'tailwind' })}
			>
				Tailwind
			</div>
			<div
				class="cursor-pointer opacity-50 hover:opacity-75 data-[state=active]:opacity-100"
				{...$trigger({ value: 'controlled' })}
			>
				Controlled
			</div>
			<div
				class="cursor-pointer opacity-50 hover:opacity-75 data-[state=active]:opacity-100"
				{...$trigger({ value: 'no-value-arg' })}
			>
				No value arg
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
		<div {...$content('no-value-arg')}>
			<HighlightSvelte code={noValueArgCode} class=" text-sm" />
		</div>
	</div>
</div>
