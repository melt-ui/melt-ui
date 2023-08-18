<script lang="ts">
	import '../app.postcss';
	import { dev } from '$app/environment';
	import { JsIndicator, SiteHeader, TailwindIndicator } from '$docs/components/index.js';

	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="relative flex min-h-screen flex-col" id="page">
	<header class="sticky top-0 z-40 hidden w-full bg-neutral-900 px-2 pt-2 md:block">
		<SiteHeader />
	</header>
	<div class="flex flex-1">
		<slot />
	</div>
	<!-- Mobile Navbar -->
	<header class="sticky bottom-0 z-40 w-full bg-neutral-900 px-2 pb-3 md:hidden">
		<SiteHeader />
	</header>
	{#if dev}
		<TailwindIndicator />
		<JsIndicator />
	{/if}
</div>
