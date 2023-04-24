<script>
	import '../app.postcss';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<main class="flex min-h-screen flex-col">
	<nav class="flex items-end justify-between px-6 py-4">
		<a class="flex items-center gap-2 font-sans text-xl" href="/">
			<img
				class="h-8 w-8 rounded-sm object-contain"
				src="/radix-svelte.svg"
				alt="Radix and Svelte logos"
			/>
			<span class="font-bold">Radix</span> Svelte
		</a>

		<div class="flex flex-row gap-4">
			<a
				href="https://github.com/TGlide/radix-svelte"
				class="underline-offset-2 opacity-75 hover:underline hover:opacity-100 focus:underline active:opacity-75"
				>GitHub</a
			>
			<a
				href="/docs/accordion"
				class="underline-offset-2 opacity-75 hover:underline hover:opacity-100 focus:underline active:opacity-75"
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
			<span class="flex gap-1">
				Inspired by <a
					href="https://radix-ui.com/"
					class="hover:underline focus:underline active:opacity-75">Radix UI</a
				>
			</span>
			<span class="opacity-50"> Not affiliated with Radix UI or WorkOS. </span>
		</div>
	</footer>
</main>
