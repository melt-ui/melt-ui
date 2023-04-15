<script>
	import '../app.postcss';

	import '@fontsource/inter/300.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/inter/800.css';
	import '@fontsource/inter/900.css';
</script>

<main class="flex flex-col min-h-screen">
	<nav class="flex justify-between items-center border-b border-zinc-400 px-4 py-2">
		<a class="flex items-center gap-2 font-sans text-xl font-semibold" href="/">
			<img class="h-9 w-9 rounded-sm object-contain" src="/logo.svg" alt="Radix and Svelte logos" />
			Radix Svelte
		</a>

		<a href="/docs/accordion" class="hover:opacity-75 underline">Documentation</a>
	</nav>
	<div class="grow flex flex-col">
		<slot />
	</div>
</main>
