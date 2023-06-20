<script lang="ts">
	import { createSelect, type SelectOptionArgs } from '$lib';
	import ChevronDown from '~icons/lucide/chevron-down';
	import Check from '~icons/lucide/check';

	export let options: SelectOptionArgs<string>[] = [];
	export let selected: string = options[0].value;

	const {
		selectedText,
		trigger,
		menu,
		option,
		isSelected,
		selected: localSelected,
	} = createSelect({
		selected,
	});

	localSelected.subscribe((value) => {
		typeof value === 'string' && (selected = value);
	});
	$: localSelected.set(selected);
</script>

<button
	class="flex w-[180px] items-center justify-between rounded-md border border-magnum-700 bg-neutral-800 px-3 py-1 text-magnum-600
  outline-none transition-opacity hover:opacity-75 focus:!border-magnum-500 focus:!text-magnum-500"
	{...$trigger}
	aria-label="Select"
>
	{$selectedText || 'Select an option'}
	<ChevronDown />
</button>

<ul
	class="0 z-10 flex max-h-[360px] flex-col gap-2
  overflow-y-auto rounded-md bg-neutral-800 p-1 shadow-md"
	{...$menu}
>
	{#each options as o}
		<li
			class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-500 outline-none focus:!text-magnum-500
			data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[selected]:text-magnum-600 data-[disabled]:line-through"
			{...$option({ ...o })}
		>
			{#if $isSelected(o.value)}
				<div class="check">
					<Check />
				</div>
			{/if}
			{o.label}
		</li>
	{/each}
</ul>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2;
		translate: 0 calc(-50% + 1px);
	}
</style>
