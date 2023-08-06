<script lang="ts">
	import '../app.postcss';
	import { dev } from '$app/environment';
	import { JsIndicator, SearchDialog, SiteHeader, TailwindIndicator } from '$docs/components/index.js';

	import { createDialog } from '$lib';
	import { setContext } from 'svelte';

	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	const searchDialog = createDialog();

	setContext('searchDialog', searchDialog);

	const { states: { open }} = searchDialog;

	function keydownHandler(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			open.set($open ? false : true);
		}
	}
</script>

<svelte:window on:keydown={keydownHandler} />

<div class="relative flex min-h-screen flex-col-reverse md:flex-col" id="page">
    <header class="sticky bottom-0 md:top-0 z-40 w-full bg-neutral-900 px-2 py-2">
        <SiteHeader />
    </header>
    <div class="flex flex-1">
        <slot />
    </div>
    {#if dev}
        <TailwindIndicator />
        <JsIndicator />
    {/if}
</div>

<SearchDialog />