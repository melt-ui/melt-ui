<script lang="ts">
	import { TOC, Description, Preview, Features } from '$docs/components';
	import type { SvelteComponent } from 'svelte';
	import type { PageData } from './$types';
	import { cn } from '$docs/utils';
	import { createSeparator } from '$lib';
	import { page } from '$app/stores';

	const { root: separator } = createSeparator();

	export let data: PageData;
	// eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
	type Component = $$Generic<typeof SvelteComponent>;
	$: component = data.doc.default as unknown as Component;
	$: doc = data.doc.metadata;
	$: snippets = data.snippets;
	$: mainPreview = data.mainPreview as unknown as Component;
	$: builderData = data.builderData;
</script>

{#key $page.url.pathname}
	<main class="relative px-2 py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_240px]">
		<div class="mx-auto w-full min-w-0">
			<div class="space-y-2">
				<h1 class={cn('scroll-m-20 text-4xl font-bold tracking-tight')}>
					{doc.title}
				</h1>
				{#if doc.description}
					<Description>
						{doc.description}
					</Description>
				{/if}
			</div>
			<div {...$separator} class="my-4 md:my-6" />
			<div class="mdsvex" id="mdsvex">
				<Preview code={snippets.main} fullwidth>
					<svelte:component this={mainPreview} />
				</Preview>
				<Features features={builderData.features} />

				<svelte:component this={component} {snippets} />
			</div>
			<div {...$separator} class="my-4 md:my-6" />
			<!-- <DocsPager /> -->
		</div>
		<div class="hidden text-sm xl:block">
			<div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">
				{#key $page.url.pathname}
					<TOC />
				{/key}
			</div>
		</div>
	</main>
{/key}
