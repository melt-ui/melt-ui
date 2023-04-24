<script>
	import '../app.postcss';

	import '@fontsource/inter/300.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/inter/800.css';
	import '@fontsource/inter/900.css';

	import GithubLogo from '~icons/radix-icons/github-logo';
	import DiscordLogo from '~icons/radix-icons/discord-logo';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<main class="flex min-h-screen flex-col">
	<nav class="flex items-center justify-between gap-2 border-b border-zinc-400 px-2 lg:px-4 py-2">
		<a class="flex items-center gap-2 lg:text-xl font-sans font-bold" href="/">
			<img
				class="w-7 h-7 lg:h-9 lg:w-9 rounded-sm object-contain"
				src="/logo.svg"
				alt="Radix and Svelte logos"
			/>
			Radix Svelte
		</a>

		<div class="flex items-center gap-2 lg:gap-4">
			<a
				href="https://github.com/tglide/radix-svelte"
				target="_blank"
				class="hover:opacity-75 lg:text-xl"
			>
				<GithubLogo />
			</a>
			<a
				href="https://discord.com/invite/gQrpPs34xH"
				target="_blank"
				class="hover:opacity-75 lg:text-xl"
			>
				<DiscordLogo />
			</a>
			<a href="/docs/accordion" class="underline hover:opacity-75">Documentation</a>
		</div>
	</nav>
	<div class="flex grow flex-col">
		<slot />
	</div>
</main>
