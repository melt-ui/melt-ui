<script lang="ts">
	import { createSelect } from '$lib';
	import { Docs } from '$routes/(components)';
	import Check from '~icons/lucide/check';

	const { selectedText, trigger, menu, option, isSelected } = createSelect();

	const options = {
		fruits: ['Apple', 'Banana', 'Orange', 'Pineapple'],
		vegetables: ['Broccoli', 'Carrot', 'Potato', 'Tomato'],
	};
</script>

<Docs.PreviewWrapper>
	<button
		class="rounded-md bg-white px-4 py-1 text-magnum-700 outline-none
	hover:opacity-75 focus:ring focus:ring-magnum-400"
		{...$trigger()}
	>
		{$selectedText || 'Select an option'}
	</button>

	<ul
		class="z-10 flex max-h-[300px] min-w-[200px] flex-col gap-2 overflow-y-auto rounded-md
	bg-white p-1 lg:max-h-none"
		{...$menu}
	>
		{#each Object.entries(options) as [key, arr]}
			<li class="py-1 pl-4 pr-4 font-bold capitalize text-neutral-800">{key}</li>
			{#each arr as item}
				<li
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800 outline-none
					hocus:bg-magnum-100 hocus:text-magnum-700"
					{...$option({ value: item })}
				>
					{#if $isSelected(item)}
						<div class="check">
							<Check />
						</div>
					{/if}
					{item}
				</li>
			{/each}
		{/each}
	</ul>
</Docs.PreviewWrapper>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2  text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
