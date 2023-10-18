<script lang="ts">
	import { goto } from '$app/navigation';
	import { createCombobox, createDialog, melt } from '$lib';
	import { Check, CornerDownRight, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PagefindSearchFragment, Pagefind, PagefindSearchResult } from '../../pagefind.js';

	let pagefind: Pagefind;
	let results: PagefindSearchResult[] = [];

	onMount(async () => {
		pagefind = await import('../../pagefind/pagefind.js');

		await pagefind.init();
		results = (await pagefind.search('')).results;
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
	} = createCombobox<PagefindSearchFragment>({
		onSelectedChange({ next }) {
			if (next) {
				gotoLink(next.value.url);
			}
			return undefined;
		},
		forceVisible: true,
	});

	const {
		elements: { trigger, portalled, content, overlay },
		states: { open },
	} = createDialog({
		onOpenChange({ next }) {
			if (!next) {
				inputValue.set('');
				results = [];
			}
			return next;
		},
		defaultOpen: true,
	});

	let debounceTimer: ReturnType<typeof setTimeout>;

	const debounce = (callback: () => void) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(callback, 450);
	};

	$: {
		if (pagefind) {
			debounce(() => {
				pagefind.search($inputValue).then((r) => {
					results = r.results;
				});
			});
		}
	}
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

<button class="ml-6 text-neutral-400 transition-colors hover:text-neutral-50" use:melt={$trigger}>
	<Search class="h-5 w-5" />
</button>

<div use:melt={$portalled} class="contents">
	<div use:melt={$overlay} class="fixed inset-0 z-40 bg-black bg-opacity-50" />
	<div
		use:melt={$content}
		class="fixed left-1/2 top-96 z-50 grid -translate-x-1/2 place-items-center"
	>
		<div class="flex flex-col gap-1">
			<div class="relative">
				<input
					use:melt={$input}
					class="flex h-10 w-[600px] items-center justify-between rounded-lg
            border border-neutral-400 bg-neutral-800 px-3 pl-8 text-white focus:border-magnum-400"
					placeholder="Search..."
					on:keydown={(e) => {
						if (e.key === 'Escape') {
							cbOpen.set(false);
							open.set(false);
						}
					}}
				/>

				<Search class="absolute top-1/2 ml-2 -translate-y-1/2 square-4" />
			</div>
		</div>

		<div class="z-10 flex max-h-[600px] flex-col" use:melt={$menu} class:hidden={!$inputValue}>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				class="flex max-h-full flex-col gap-0 overflow-y-auto rounded-lg bg-neutral-800 px-2 py-2 text-white"
			>
				{#each results as result, index (index)}
					{#await result.data()}
						<!-- nothingness -->
					{:then data}
						<div
							use:melt={$option({ value: data, label: data.meta.title })}
							class="group relative scroll-my-2 rounded-md px-4 py-2 data-[disabled]:opacity-50"
						>
							<a
								class="title text-lg font-semibold underline hover:opacity-75"
								href={sanitizeLink(data.url)}>{data.meta.title}</a
							>
							<p class="mt-1 font-light">
								{@html data.excerpt}
							</p>
							{#each data.sub_results.filter(({ title }) => title !== data.meta.title) as subresult}
								<div class="subresult py-2 pl-2">
									<div class="flex items-center gap-1">
										<CornerDownRight class="opacity-75 square-4" />
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
						</div>
					{/await}
				{:else}
					<li class="relative cursor-pointer rounded-md py-1 px-4">No results found</li>
				{/each}
			</div>
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

	[data-highlighted] .title {
		position: relative;
		color: theme('colors.magnum.400');

		&::before {
			content: '';
			position: absolute;
			top: 50%;
			translate: 0 -30%;
			left: -12px;
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background-color: theme('colors.magnum.400');
		}
	}
</style>
