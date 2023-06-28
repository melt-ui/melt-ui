<script lang="ts">
	import { createSelect } from '$lib';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';

	const { label, trigger, menu, option, isSelected } = createSelect();

	const options = {
		fruits: ['Apple', 'Banana', 'Pineapple'],
		vegetables: ['Broccoli', 'Potato', 'Tomato'],
	};
</script>

<button class="trigger" {...$trigger} use:trigger.action aria-label="Food">
	{$label || 'Select an option'}
	<ChevronDown />
</button>

<ul class="menu" {...$menu} use:menu.action>
	{#each Object.entries(options) as [key, arr]}
		<li class="label">{key}</li>
		{#each arr as item}
			<li class="option" {...$option({ value: item, label: item })} use:option.action>
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

<style lang="postcss">
	.label {
		@apply py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800;
	}
	.menu {
		@apply z-10 flex max-h-[360px] flex-col overflow-y-auto;
		@apply rounded-md bg-white p-1;
		@apply ring-0 !important;
	}
	.option {
		@apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800;
		@apply focus:z-10 focus:text-magnum-700;
		@apply data-[highlighted]:bg-magnum-50 data-[highlighted]:text-magnum-900;
		@apply data-[selected]:bg-magnum-100 data-[selected]:text-magnum-900;
	}
	.trigger {
		@apply flex h-10 w-[180px] items-center justify-between rounded-md bg-white px-3;
		@apply py-2 text-magnum-700 transition-opacity hover:opacity-90;
	}
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
