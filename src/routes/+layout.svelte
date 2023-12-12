<script lang="ts">
	import '@fontsource/inter/100.css';
	import '@fontsource/inter/200.css';
	import '@fontsource/inter/300.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/inter/800.css';
	import '@fontsource/inter/900.css';
	import '../app.postcss';
	import '../fonts.css';

	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { JsIndicator, SiteHeader, TailwindIndicator } from '$docs/components/index.js';
	import { cn } from '$docs/utils';

	import { ModeWatcher } from 'mode-watcher';

	$: isRoot = $page.url.pathname === '/';
</script>

<ModeWatcher defaultMode="dark" />

<div class="relative flex min-h-screen flex-col md:flex-col-reverse" id="page">
	<div class="flex flex-1">
		<slot />
	</div>
	<header
		class={cn(
			'sticky bottom-0 z-40 w-full px-2 pb-2 md:bottom-[none] md:top-0 md:pb-0 md:pt-2',
			!isRoot && 'bg-neutral-900'
		)}
	>
		<SiteHeader />
	</header>

	{#if dev}
		<TailwindIndicator />
		<JsIndicator />
	{/if}
</div>
