<script lang="ts">
	import { TOC, Description } from '$docs/components/index.js';

	import type { SvelteComponent } from 'svelte';
	import type { PageData } from './$types.js';
	import { cn } from '$docs/utils/index.js';
	import { createSeparator, melt } from '$lib/index.js';
	import { page } from '$app/stores';

	const {
		elements: { root: separator },
	} = createSeparator();

	export let data: PageData;
	// eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
	type Component = $$Generic<typeof SvelteComponent>;
	$: component = data.component as unknown as Component;
	$: doc = data.metadata;
</script>

<main class="relative px-2 py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_240px]">
	<div class="mx-auto w-full min-w-0">
		<div class="mb-4 space-y-2 md:mb-6">
			<h1 class={cn('scroll-m-20 text-4xl font-bold tracking-tight')}>
				{doc.title}
			</h1>
			{#if doc.description}
				<Description>
					{doc.description}
				</Description>
			{/if}
		</div>
		<div class="mdsvex" id="mdsvex">
			<svelte:component this={component} />
		</div>
		<div use:melt={$separator} class="my-4 md:my-6" />
		<!-- <DocsPager /> -->
	</div>
	<div class="hidden text-sm xl:block">
		<div class="fixed top-16 h-[calc(100vh-4rem)] overflow-visible pt-6">
			{#key $page.url.pathname}
				<TOC />
			{/key}
		</div>
	</div>
</main>
