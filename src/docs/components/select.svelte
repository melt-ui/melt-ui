<script lang="ts">
	import { createSelect, type OptionArgs } from '$lib';
	import ChevronDown from '~icons/lucide/chevron-down';
	import Check from '~icons/lucide/check';
	export let options: OptionArgs[] = [];
	export let value = options[0].value;

	const {
		label,
		trigger,
		menu,
		option,
		isSelected,
		value: localValue,
	} = createSelect({
		value,
	});

	localValue.subscribe((v) => {
		typeof v === 'string' && (value = v);
	});
	$: localValue.set(value);
</script>

<button
	class="flex w-[140px] items-center justify-between rounded-md border border-magnum-700 bg-neutral-800 px-3 py-1 text-magnum-600
  outline-none transition-opacity hover:opacity-75 focus:!border-magnum-400 focus:!text-magnum-400"
	{...$trigger}
	use:trigger.action
	aria-label="Select"
>
	{#if $label === 'css'}
		CSS
	{:else if $label === 'tailwind'}
		Tailwind
	{:else}
		Select an option
	{/if}
	<ChevronDown />
</button>

<ul
	class="0 z-10 flex max-h-[360px] flex-col
  overflow-y-auto rounded-md bg-neutral-800 p-1 shadow-md"
	{...$menu}
	use:menu.action
>
	{#each options as o}
		<li
			class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-500 outline-none focus:!text-magnum-400 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[selected]:text-magnum-600 data-[disabled]:line-through"
			{...$option({ ...o })}
			use:option.action
		>
			{#if $isSelected(o.value)}
				<div class="check">
					<Check />
				</div>
			{/if}

			{#if o.label === 'css'}
				CSS
			{:else if o.label === 'tailwind'}
				Tailwind
			{/if}
		</li>
	{/each}
</ul>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2;
		translate: 0 calc(-50% + 1px);
	}
</style>
