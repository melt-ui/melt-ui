<script>
	import '../app.postcss';

	import '@fontsource/inter/300.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/inter/800.css';
	import '@fontsource/inter/900.css';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<main class="flex min-h-screen flex-col">
	<nav class="flex items-center justify-between border-b border-zinc-400 px-4 py-2">
		<a class="flex items-center gap-2 text-xl font-sans font-bold" href="/">
			<img class="h-9 w-9 rounded-sm object-contain" src="/logo.svg" alt="Radix and Svelte logos" />
			Radix Svelte
		</a>

		<a href="/docs/accordion" class="underline hover:opacity-75">Documentation</a>
	</nav>
	<div class="flex grow flex-col">
		<slot />
	</div>
</main>
