<script>
	import '../app.postcss';

	import '@fontsource/overpass/400.css';
	import '@fontsource/overpass/600.css';
	import '@fontsource/overpass/700.css';
	import '@fontsource/overpass/400-italic.css';
	import '@fontsource/overpass/600-italic.css';
	import '@fontsource/overpass/700-italic.css';
	import '@fontsource/overpass-mono/400.css';
	import '@fontsource/overpass-mono/600.css';
	import '@fontsource/overpass-mono/700.css';
  
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
  
	import GitHub from '~icons/simple-icons/github';
	import Discord from '~icons/simple-icons/discord';

	onMount(async () => {
		const { inject } = await import('@vercel/analytics');

		inject({ mode: dev ? 'development' : 'production' });
	});
</script>

<main class="flex min-h-screen flex-col">
	<nav class="flex items-end justify-between px-6 py-4">
		<a class="flex items-end gap-2 font-sans text-xl" href="/">
			<img
				class="h-8 w-8 rounded-sm object-contain fill-vermilion-500"
				src="/radix-svelte.svg"
				alt="Radix and Svelte logos"
			/>
			<span class="font-bold">Radix</span> Svelte
		</a>

		<div class="flex flex-row gap-4">
			<a
				href="https://github.com/TGlide/radix-svelte"
				target="_blank"
				class="underline-offset-2 opacity-75 hover:underline hover:opacity-100 focus:underline active:translate-y-px"
			>
				<span class="hidden lg:block">GitHub</span>
				<GitHub
					class="lg:hidden h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px"
				/>
			</a>
			<a
				href="https://discord.com/invite/gQrpPs34xH"
				target="_blank"
				class="underline-offset-2 opacity-75 hover:underline hover:opacity-100 focus:underline active:translate-y-px"
			>
				<span class="hidden lg:block">Discord</span>
				<Discord
					class="lg:hidden h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px"
				/>
			</a>
			<a
				href="/docs/accordion"
				class="underline-offset-2 opacity-75 hover:underline hover:opacity-100 focus:underline active:translate-y-px"
				>Documentation</a
			>
		</div>
	</nav>
	<div class="flex grow flex-col">
		<slot />
	</div>
	<footer>
		<div
			class="flex flex-col items-start justify-between gap-2 px-6 py-4 lg:flex-row lg:items-center"
		>
			<div class="flex flex-row gap-1">
				<span class="flex gap-1 opacity-50">Inspired by</span>
				<a
					href="https://radix-ui.com/"
					class="underline-offset-2 opacity-75 hover:underline hover:opacity-100 focus:underline active:translate-y-px"
					>Radix UI</a
				>
			</div>
			<span class="opacity-50"> Not affiliated with Radix UI or WorkOS. </span>
		</div>
	</footer>
</main>
