<script lang="ts">
	import { goto } from '$app/navigation';
	import { Tooltip } from '$docs/components/index.js';
	import { createCombobox, createDialog, melt } from '$lib/index.js';
	import { CornerDownRight, LoaderIcon, Search as SearchIcon } from '$icons/index.js';
	import { onMount } from 'svelte';
	import type { Pagefind, PagefindSearchFragment, PagefindSubResult } from '../../pagefind.js';

	let pagefind: Pagefind | null = null;

	onMount(async () => {
		// @ts-expect-error - Pagefind will be present at runtime
		pagefind = (await import('/pagefind/pagefind.js')) as Pagefind;
		if (!pagefind) return;
		await pagefind.init();
	});

	const sanitizeLink = (url: string) => {
		return url.replace('.html', '').replace('src/', '');
	};

	const gotoLink = (url: string) => {
		open.set(false);
		cbOpen.set(false);
		goto(sanitizeLink(url));
	};

	const {
		elements: { input, menu, option },
		states: { open: cbOpen, inputValue },
	} = createCombobox<PagefindSearchFragment | PagefindSubResult>({
		onSelectedChange({ next }) {
			if (next) {
				gotoLink(next.value.url);
			}
			return undefined;
		},
		preventScroll: false,
		highlightOnHover: false,
	});

	let comboboxInput: HTMLInputElement | null = null;

	const {
		elements: { trigger, portalled, content, overlay },
		states: { open },
	} = createDialog({
		onOpenChange({ next }) {
			if (!next) {
				inputValue.set('');
				search = new Promise((resolve) => resolve([]));
			}
			return next;
		},
		openFocus: () => comboboxInput,
	});

	let search: Promise<PagefindSearchFragment[]> | null = null;

	async function getResultsFromSearch(query: string) {
		if (!pagefind || !query) {
			return [];
		}
		const s = await pagefind.debouncedSearch(query, undefined, 450);
		return await Promise.all(
			s.results.map(async (result) => {
				return await result.data();
			})
		);
	}

	$: search = getResultsFromSearch($inputValue);
</script>

<svelte:window
	on:keydown={(e) => {
		const isCtrl = e.ctrlKey || e.metaKey;
		if (e.key === '/' || (e.key === 'k' && isCtrl)) {
			e.preventDefault();
			open.set(true);
		}
	}}
/>

<Tooltip text="Search">
	<button class="transition-colors hover:text-neutral-50" use:melt={$trigger}>
		<SearchIcon class="h-5 w-5" />
	</button>
</Tooltip>

<div use:melt={$portalled} class="contents">
	<div use:melt={$overlay} class="fixed inset-0 z-40 bg-black bg-opacity-50" />
	<div
		use:melt={$content}
		class="fixed left-1/2 top-4 z-50 grid -translate-x-1/2 place-items-center md:top-64"
	>
		<div class="flex flex-col gap-1">
			<div class="relative">
				<input
					bind:this={comboboxInput}
					use:melt={$input}
					class="flex h-10 w-[calc(100vw-2rem)] max-w-[600px] items-center justify-between rounded-lg border
            border-neutral-500 bg-neutral-800 px-3 pl-8 text-white focus:border-magnum-400"
					placeholder="Search..."
					on:keydown={(e) => {
						if (e.key === 'Escape') {
							cbOpen.set(false);
							open.set(false);
						}
					}}
				/>
				<SearchIcon class="absolute left-2 top-1/2 size-4 -translate-y-1/2" />
				{#if search}
					{#await search}
						<div class="absolute right-2 top-1/2 -translate-y-1/2">
							<LoaderIcon class="size-4 animate-spin" />
						</div>
					{/await}
				{/if}
			</div>
		</div>

		<div
			class="z-50 flex max-h-[min(600px,50vh)] flex-col"
			use:melt={$menu}
			class:hidden={!$inputValue}
		>
			{#if search}
				{#await search then results}
					<div
						class="flex max-h-full flex-col gap-0 overflow-y-auto rounded-lg bg-neutral-800 px-2 py-2 text-white"
					>
						<p aria-live="polite" class="px-4 py-1 font-light opacity-50">
							{results.length === 0 ? 'No results' : `Found ${results.length} results`}
						</p>
						{#each results as data, index (index)}
							{@const isLast = index === results.length - 1}

							<div
								use:melt={$option({ value: data, label: data.meta.title })}
								class="relative scroll-my-2 rounded-md px-4 py-2 data-[disabled]:opacity-50"
							>
								<a
									class="title text-lg font-semibold underline hover:opacity-75"
									href={sanitizeLink(data.url)}>{data.meta.title}</a
								>
								<p class="mt-1 font-light">
									{@html data.excerpt}
								</p>
							</div>
							{#each data.sub_results.filter(({ title }) => title !== data.meta.title) as subresult}
								<div
									class="subresult ml-3 scroll-my-2 rounded-md py-2 pl-3"
									use:melt={$option({ value: subresult, label: subresult.title })}
								>
									<div class="flex items-center gap-1">
										<CornerDownRight class="size-4 opacity-75" />
										<a
											class="font-semibold underline hover:opacity-75"
											href={sanitizeLink(subresult.url)}
										>
											{subresult.title}
										</a>
									</div>
									<p class="mt-2 text-sm font-light opacity-75">
										{@html subresult.excerpt}
									</p>
								</div>
							{/each}
							{#if !isLast}
								<hr class="mx-4 my-2 border-neutral-700" />
							{/if}
						{/each}
					</div>
				{/await}
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	[data-melt-combobox-menu] :global(mark) {
		background-color: theme('colors.magnum.400/0.5');
		color: theme('colors.white');
		border-radius: theme('borderRadius.sm');
		padding-inline: 1px;
		font-weight: 500;
	}

	.subresult :global(mark) {
		background-color: theme('colors.magnum.400/0.5');
		color: theme('colors.white');
		font-weight: 300;
	}

	[data-highlighted] {
		background-color: theme('colors.magnum.400/0.25');
		color: theme('colors.white');

		/* :global(mark) {
			background-color: theme('colors.magnum.500');
			color: theme('colors.magnum.100');
		} */
	}
</style>
