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
	import { cn } from '$routes/helpers';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import TailwindIndicator from './(components)/tailwind-indicator.svelte';
	import { dev } from '$app/environment';

	$: isRoot = $page.url.pathname === '/';
</script>

<div class="relative flex min-h-screen flex-col">
	<header class={cn('w-full bg-neutral-900 shadow-sm', !isRoot && 'sticky top-0 z-50')}>
		<div class="container flex items-center justify-between px-2 py-4">
			<div class="flex h-14 w-full items-center justify-between rounded-lg bg-neutral-800 px-6">
				<div class="mr-4 flex w-full">
					<a href="/" class="flex items-center space-x-2">
						<img class="h-9 rounded-sm" src="/logo.svg" alt="Melt UI" />
					</a>
				</div>
				<nav class="flex items-center space-x-6 text-sm font-medium">
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
							class="block h-6 w-6 md:hidden"
							aria-label="Toggle menu"
							on:click={() => {
								$isMenuOpen = !$isMenuOpen;
							}}
						>
							{#if $isMenuOpen}
								<X class="h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px" />
							{:else}
								<Menu
									class="z-50 h-6 w-6 text-white opacity-75 hover:opacity-100 active:translate-y-px"
								/>
							{/if}
						</button>
					{/if}
				</nav>
			</div>
		</div>
	</header>
	<div class="flex-1">
		<slot />
	</div>
	{#if dev}
		<TailwindIndicator />
	{/if}
</div>
