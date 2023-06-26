<script lang="ts">
	import { createRadioGroup } from '@melt-ui/svelte';

	const { root, item, isChecked } = createRadioGroup({
		value: 'default',
	});

	const optionsArr = ['default', 'comfortable', 'compact'];
</script>

<div
	{...$root}
	class="flex flex-col gap-3 data-[orientation=horizontal]:flex-row"
	aria-label="View density"
>
	{#each optionsArr as option}
		<div class="flex items-center gap-3">
			<button
				{...$item(option)}
				use:item.action
				class="grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow-sm
			hover:bg-magnum-100"
				id={option}
				aria-labelledby="{option}-label"
			>
				{#if $isChecked(option)}
					<div class="h-3 w-3 rounded-full bg-magnum-500" />
				{/if}
			</button>
			<label class="capitalize leading-none text-white" for={option} id="{option}-label">
				{option}
			</label>
		</div>
	{/each}
</div>
