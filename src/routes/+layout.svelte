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
		<a class="flex items-end gap-1 font-sans text-xl" href="/">
			<img
				class="h-8 w-8 rounded-sm fill-vermilion-500 object-contain"
				src="/radix-svelte.svg"
				alt="Radix and Svelte logos"
			/>
			<span class="font-bold">Radix</span> Svelte
		</a>

		<div class="flex flex-row gap-4">
			<a
				href="https://github.com/TGlide/radix-svelte"
				target="_blank"
				class="underline decoration-white/50 underline-offset-4 opacity-75 active:translate-y-px hocus:decoration-vermilion-500 hocus:opacity-100"
			>
				<span class="hidden lg:block">GitHub</span>
				<GitHub
					class="h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px lg:hidden"
				/>
			</a>
			<a
				href="https://discord.com/invite/gQrpPs34xH"
				target="_blank"
				class="underline decoration-white/50 underline-offset-4 opacity-75 active:translate-y-px hocus:decoration-vermilion-500 hocus:opacity-100"
			>
				<span class="hidden lg:block">Discord</span>
				<Discord
					class="h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px lg:hidden"
				/>
			</a>
			<a
				href="/docs/accordion"
				class="underline decoration-white/50 underline-offset-4 opacity-75 active:translate-y-px hocus:decoration-vermilion-500 hocus:opacity-100"
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
					target="_blank"
					class="underline decoration-white/50 underline-offset-4 opacity-75 active:translate-y-px hocus:decoration-vermilion-500 hocus:opacity-100"
					>Radix UI</a
				>
			</div>
			<span class="opacity-50"> Not affiliated with Radix UI or WorkOS. </span>
		</div>
	</footer>
</main>
