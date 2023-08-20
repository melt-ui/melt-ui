<script lang="ts">
	import { createRadioGroup, melt } from '$lib/index.js';

	const {
		elements: { root, item },
		helpers: { isChecked },
	} = createRadioGroup({
		defaultValue: 'default',
	});

	const optionsArr = ['default', 'comfortable', 'compact'];
</script>

<div
	use:melt={$root}
	class="flex flex-col gap-3 data-[orientation=horizontal]:flex-row"
	aria-label="View density"
>
	{#each optionsArr as option}
		<div class="flex items-center gap-3">
			<button
				use:melt={$item(option)}
				class="grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow-sm
			hover:bg-magnum-100"
				id={option}
				aria-labelledby="{option}-label"
			>
				{#if $isChecked(option)}
					<div class="h-3 w-3 rounded-full bg-magnum-500" />
				{/if}
			</button>
			<label
				class="font-medium capitalize leading-none text-magnum-900"
				for={option}
				id="{option}-label"
			>
				{option}
			</label>
		</div>
	{/each}
</div>
