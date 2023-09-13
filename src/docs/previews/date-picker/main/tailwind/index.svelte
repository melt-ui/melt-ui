<script lang="ts">
	import { createDatePicker } from '$lib/builders';
	import {
		ChevronRight,
		ChevronLeft,
		ChevronsRight,
		ChevronsLeft,
	} from 'lucide-svelte';
	import { dateFormatter } from './formatters';
	import { melt } from '$lib';

	const {
		elements: {
			content,
			nextMonthButton,
			prevMonthButton,
			nextYearButton,
			prevYearButton,
			date,
		},
		states: { value, dates, lastMonthDates, nextMonthDates },
		options: { mode },
	} = createDatePicker({
		mode: 'range',
		allowDeselect: true,
	});
</script>

<div {...$content} use:content class="content">
	<div class="flex flex-col gap-2.5 text-magnum-800">
		<div class="text-magnum-800">
			{dateFormatter.format($value[0] || new Date())}
		</div>
		<div class="buttons-wrapper">
			<div class="flex items-center space-x-2">
				<button use:melt={$prevYearButton} class="button">
					<ChevronsLeft />
				</button>
				<button use:melt={$prevMonthButton} class="button">
					<ChevronLeft />
				</button>
			</div>
			<div class="flex items-center space-x-2">
				<button use:melt={$nextMonthButton} class="button">
					<ChevronRight />
				</button>
				<button use:melt={$nextYearButton} class="button">
					<ChevronsRight />
				</button>
			</div>
		</div>
		<div class="grid grid-cols-7 gap-2">
			{#each $lastMonthDates as d}
				<button
					use:date
					{...$date({ label: d.toDateString(), value: d, disabled: true })}
					class="date"
				>
					<span class="">{d.getDate()}</span>
				</button>
			{/each}
			{#each $dates as d}
				<button
					use:date
					{...$date({ label: d.toDateString(), value: d, disabled: false })}
					class="date"
				>
					<span class="">{d.getDate()}</span>
				</button>
			{/each}
			{#each $nextMonthDates as d}
				<button
					use:date
					{...$date({ label: d.toDateString(), value: d, disabled: true })}
					class="date"
				>
					<span class="">{d.getDate()}</span>
				</button>
			{/each}
		</div>
	</div>
</div>
{#if $mode === 'range'}
	<span class="text-magnum-900 text-xs"
		>Selected Range: {dateFormatter.format($value[0])} - {dateFormatter.format(
			$value[1],
		)}</span
	>
{:else if $mode === 'single'}
	<span class="text-magnum-900 text-xs"
		>Selected Value: {dateFormatter.format($value[0])}</span
	>
{:else if $mode === 'multiple'}
	<span class="text-magnum-900 text-xs"
		>Selected Value:
		{#each $value as v, i (i)}
			{dateFormatter.format(v)}
		{/each}
	</span>
{/if}

<style lang="postcss">
	.input {
		@apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
		@apply ring-offset-magnum-300 focus-visible:ring;
		@apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
		@apply flex-1 items-center justify-center;
		@apply px-2.5 text-sm leading-none text-magnum-700;
	}

	.trigger {
		@apply inline-flex w-64 items-center  justify-center rounded bg-white p-0 px-2 py-1 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.close {
		@apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply bg-white p-0 text-sm font-medium;
	}

	.button {
		@apply flex h-6 w-6 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring-1 focus-visible:ring-magnum-400;
		@apply bg-white p-0 text-sm font-medium;
	}

	.content {
		@apply z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm;
	}

	.buttons-wrapper {
		@apply flex items-center justify-between border-y border-magnum-700 py-1;
	}

	.date {
		@apply flex h-6 w-6 items-center justify-center rounded hover:bg-magnum-100 data-[selected]:bg-magnum-200 data-[disabled]:opacity-40;
	}

	.date span {
		@apply text-sm text-magnum-800;
	}
</style>
