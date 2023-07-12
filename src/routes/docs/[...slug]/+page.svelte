<script lang="ts">
	import { TOC, Description } from '$docs/components';

	import type { SvelteComponent } from 'svelte';
	import type { PageData } from './$types';
	import { cn } from '$docs/utils';
	import { createSeparator } from '$lib';
	import { page } from '$app/stores';

	const { root: separator } = createSeparator();

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
		<div melt={$separator} class="my-4 md:my-6" />
		<!-- <DocsPager /> -->
	</div>
	<div class="hidden text-sm xl:block">
		<div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-visible pt-6">
			{#key $page.url.pathname}
				<TOC />
			{/key}
		</div>
	</div>
</main>
