<script lang="ts" context="module">
	export const isMenuOpen = writable(false);
</script>

<script lang="ts">
	import '../app.postcss';

	import GitHub from '~icons/simple-icons/github';
	import Discord from '~icons/simple-icons/discord';
	import Book from '~icons/lucide/book';
	import Menu from '~icons/lucide/menu';
	import X from '~icons/lucide/x';
	import { cn } from './helpers';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';

	$: isRoot = $page.url.pathname === '/';
</script>

<main class="flex min-h-screen flex-col">
	<nav
		class={cn(
			'flex h-16 items-center justify-between bg-neutral-800 px-4 xl:px-8',
			!isRoot && 'sticky top-0 z-50'
		)}
	>
		<a class="flex items-end gap-1 text-xl" href="/">
			<img class="h-10 rounded-sm" src="/logo.svg" alt="Melt UI" />
		</a>

		<div class="flex flex-row items-center gap-4 text-lg">
			<a href="https://github.com/melt-ui/melt-ui" target="_blank" class="link">
				<span class="hidden md:block">GitHub</span>
				<GitHub
					class="h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px md:hidden"
				/>
			</a>
			<a href="https://discord.com/invite/2QDjZkYunf" target="_blank" class="link">
				<span class="hidden md:block">Discord</span>
				<Discord
					class="h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px md:hidden"
				/>
			</a>
			{#if isRoot}
				<a href="/docs" class="link">
					<span class="hidden lg:block">Docs</span>
					<Book
						class="h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px lg:hidden"
					/>
				</a>
			{:else}
				<button
					class="block h-6 w-6 xl:hidden"
					aria-label="Toggle menu"
					on:click={() => {
						$isMenuOpen = !$isMenuOpen;
					}}
				>
					{#if $isMenuOpen}
						<X class="h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px" />
					{:else}
						<Menu class="h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px" />
					{/if}
				</button>
			{/if}
		</div>
	</nav>
	<div class="flex grow flex-col">
		<slot />
	</div>
</main>
