<script lang="ts">
    import {createAutocompleteTags, melt, type AutocompleteTagsOption} from '$lib/index.js';
    import {Check, ChevronDown, X} from 'lucide-svelte';

    type Choice = {
        label: string,
    }

    const options: { [key: string]: Choice[] } = {
        sweet: [
            {label: 'Caramel'}, 
            {label: 'Chocolate'}, 
            {label: 'Strawberry'}, 
            {label: 'Cookies & Cream'}
        ],
        savory: [
            {label: 'Basil'}, 
            {label: 'Bacon'}, 
            {label: 'Rosemary'}
        ],
    };

    const {
        elements: {input, menu, option, group, groupLabel, label, tag, deleteTrigger, root},
        states: {selected, open, inputValue},
        helpers: {isSelected},
    } = createAutocompleteTags<Choice, Array<AutocompleteTagsOption<Choice>>>({
        forceVisible: true,
        positioning: {
            placement: 'bottom',
            fitViewport: true,
            sameWidth: true,
        }
    });
    
    $: filteredOptions = Object.fromEntries(Object.entries(options).map(([key, value]) => {
            //if (($selected as ComboboxOption<Array<Choice>>).some(x => x.value === choice.value)) return false; // Exclude selected options from dropdown
            return [key, value.filter((choice) => {
                const {label} = choice;
                const normalizedInput = $inputValue.toLowerCase();
                return (
                    label.toLowerCase().includes(normalizedInput)
                );
            })]
        }).filter(([_, value]) => value.length));
    let filteredOptionsEntries: Array<[string, Array<Choice>]>
    $: filteredOptionsEntries = Object.entries(filteredOptions);
</script>

<div class="flex flex-col gap-1">
    <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
    <label class="block text-magnum-900" use:melt={$label}>Favorite Flavor</label>
    <div
            use:melt={$root}
            class="flex min-w-[280px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700
		focus-within:ring focus-within:ring-magnum-400"
    >
        {#each $selected as t}
            <div
                    use:melt={$tag(t)}
                    class="flex items-center overflow-hidden rounded-md bg-magnum-200 text-magnum-900 [word-break:break-word]
						data-[highlighted]:bg-magnum-300
			data-[disabled]:bg-magnum-700 data-[disabled]:hover:cursor-default
				data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0"
            >
				<span class="flex items-center border-r border-white/10 px-1.5"
                >{t.label}</span
                >
                <button
                        use:melt={$deleteTrigger(t)}
                        class="flex h-full items-center px-1 enabled:hover:bg-magnum-300"
                >
                    <X class="square-3"/>
                </button>
            </div>
        {/each}
        

        <input
                use:melt={$input}
                type="text"
                placeholder="Search..."
                class="min-w-[200px] shrink grow basis-0 border-0 text-black outline-none focus:!ring-0 data-[invalid]:text-red-500"
        />
        <ChevronDown class="square-5 my-auto float-right"/>
    </div>

    {#if $open}
        <div
                class="z-10 flex max-h-[300px] flex-col
		overflow-y-auto rounded-lg bg-white p-1
		shadow focus:!ring-0"
                use:melt={$menu}
        >
            {#each filteredOptionsEntries as [key, arr]}
                <div use:melt={$group(key)}>
                    <div
                            class="py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800"
                            use:melt={$groupLabel(key)}
                    >
                        {key}
                    </div>
                    {#each arr as item}
                        <div
                                class="relative cursor-pointer rounded-lg py-1 pl-8 pr-4 text-neutral-800
							focus:z-10 focus:text-magnum-700
						data-[highlighted]:bg-magnum-50 data-[selected]:bg-magnum-100
						data-[highlighted]:text-magnum-900 data-[selected]:text-magnum-900"
                                use:melt={$option({value: item, label: item.label})}
                        >
                            <div class="check {$isSelected(item) ? 'block' : 'hidden'}">
                                <Check class="square-4"/>
                            </div>

                            {item.label}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">
    .check {
        position: absolute;
        left: theme(spacing.2);
        top: 50%;
        z-index: theme(zIndex.20);
        translate: 0 calc(-50% + 1px);
        color: theme(colors.magnum.500);
    }
</style>
