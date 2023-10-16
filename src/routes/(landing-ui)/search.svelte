<script lang="ts">
	import { goto } from '$app/navigation';
	import { createCombobox, createDialog, melt } from '$lib';
	import { Check, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PagefindSearchFragment, Pagefind, PagefindSearchResult } from '../../pagefind.js';

	let pagefind: Pagefind;
	let results: PagefindSearchResult[] = [];

	onMount(async () => {
		pagefind = await import('../../pagefind/pagefind.js');

		pagefind.init();
	});

	const {
		elements: { trigger, portalled, content, close, overlay },
		states: { open },
	} = createDialog();

	const {
		elements: { trigger: cbTrigger, input, menu, option },
		states: { open: cbOpen, inputValue },
		helpers: { isSelected },
	} = createCombobox<PagefindSearchFragment>({
		onSelectedChange({ next }) {
			if (next) {
				cbOpen.set(false);
				open.set(false);
				goto(next.value.url.replace('.html', '').replace('src/', ''));
			}
			return undefined;
		},
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

<button class="ml-6 text-neutral-400 transition-colors hover:text-neutral-50" use:melt={$trigger}>
	<Search class="h-5 w-5" />
</button>

<div use:melt={$portalled} class="contents">
	<div use:melt={$overlay} class="fixed inset-0 z-40 bg-black bg-opacity-50" />
	<div
		use:melt={$content}
		class="fixed left-1/2 top-1/2 z-50 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
	>
		<div class="flex flex-col gap-1">
			<div class="relative">
				<input
					use:melt={$input}
					class="flex h-10 items-center justify-between rounded-lg bg-white
            px-3 pr-12 text-black"
					placeholder="Best book ever"
					on:keydown={(e) => {
						if (e.key === 'Escape') {
							cbOpen.set(false);
							open.set(false);
						}
					}}
				/>
			</div>
		</div>

		<div class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg" use:melt={$menu}>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black"
				tabindex="0"
			>
				{#each results as result, index (index)}
					{#await result.data()}
						loading...
					{:then data}
						<button
							use:melt={$option({ value: data, label: data.meta.title })}
							class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
        hover:bg-magnum-100
        data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900
          data-[disabled]:opacity-50"
						>
							{#if $isSelected(data)}
								<div class="check absolute left-2 top-1/2 z-10 text-magnum-900">
									<Check class="square-4" />
								</div>
							{/if}
							<div class="pl-4">
								<span class="font-medium">{data.meta.title}</span>
							</div>
						</button>
					{/await}
				{:else}
					<li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">No results found</li>
				{/each}
			</div>
		</div>
	</div>
</div>
