<script lang="ts">
	import { melt, type Dialog, createSeparator } from "$lib";
	import { getContext } from "svelte";
	import { fly } from "svelte/transition";
    import { Search, ArrowRight } from 'lucide-svelte';

    type Result = {
        label: string;
        href: string
        subResults: SubResult[]
    }

    type SubResult = {
        label: string;
        href: string
    }

    const { 
        elements: { overlay, content, portalled },
        states: { open },
    } = getContext<Dialog>('searchDialog');


    let debounceTimeMs = 200;
    let inputDebounce: ReturnType<typeof setTimeout>;
    function handleInput(event: Event) {
        if (inputDebounce) clearTimeout(inputDebounce);
        inputDebounce = setTimeout(() => {
            const inputEl = event.target as HTMLInputElement;
            const query = inputEl.value;
            /*
                TODO:
                1. Input query into some sort of search algorithm
                2. Get a list of results back
                3. Convert those results to an array of type Result[]
                4. Set results to the new results
            */
        }, debounceTimeMs);
    }

    // TODO: Replace mocking data with actual searchables
    let results: Result[] = [
        {
            label: 'Dialog',
            href: '/docs/builders/dialog',
            subResults: [
                {
                    label: 'Features',
                    href: '/docs/builders/dialog#features'
                },
                {
                    label: 'Anatomy',
                    href: '/docs/builders/dialog#anatomy'
                },
                {
                    label: 'Usage',
                    href: '/docs/builders/dialog#usage'
                },
                {
                    label: 'Examples Components',
                    href: '/docs/builders/dialog#example-components'
                },
                {
                    label: 'API Reference',
                    href: '/docs/builders/dialog#api-reference'
                },
                {
                    label: 'Accesiblity',
                    href: '/docs/builders/dialog#accessibility'
                }
            ]
        }
    ];

    const { elements: { root: vertical }} = createSeparator();
</script>

<div use:melt={$portalled}>
    {#if $open}
        <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
        <div use:melt={$content} class="fixed left-[50%] top-[33%] z-50 max-h-[85vh] w-[90vw]
            max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-neutral-800
            shadow-lg"
            in:fly={{ duration: 150, y: 15 }}
        >   
            <div class="relative">
                <Search class="absolute left-2 top-[50%] -translate-y-[50%]" />
                <input class="bg-neutral-700 w-full p-4 pl-10 text-xl rounded-t-md" type="search" placeholder="Search Melt..." on:input={handleInput} />
            </div>
            <nav class="py-3 flex flex-col gap-2">
                {#each results as { label, href, subResults }}
                    <a class="p-2 font-bold text-xl flex items-center justify-between focus:bg-neutral-600 hover:bg-neutral-600" href={href} on:click={() => open.set(false)}>{label} <ArrowRight size="18" /></a>
                    <div class="flex">
                        <div class="w-0.5 bg-white mx-4" use:melt={$vertical} />
                        <div class="flex flex-col">
                            {#each subResults as { label: subLabel, href: subHref}}
                                <a class="px-2 focus:bg-neutral-600 hover:bg-neutral-600" href={subHref} on:click={() => open.set(false)}> {subLabel}</a>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <p>No results found</p>
                {/each}
            </nav>
        </div>
    {/if}
</div>