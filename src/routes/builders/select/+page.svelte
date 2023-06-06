<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';
	import Preview from './preview.svelte';
	import code from './preview.svelte?raw';

	import theme from 'svelte-highlight/styles/tomorrow-night';
</script>

<svelte:head>
	{@html theme}
</svelte:head>

<Preview />

<div class="mx-auto mt-8 max-w-6xl overflow-x-auto rounded-md">
	<HighlightSvelte {code} class=" text-sm" />
</div>
