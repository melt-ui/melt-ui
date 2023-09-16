<script lang="ts">
	import {
		createDatePicker,
		type CreateDatePickerProps,
		type Matcher,
	} from '$lib/builders';
	import {
		ChevronRight,
		ChevronLeft,
		ChevronsRight,
		ChevronsLeft,
	} from 'lucide-svelte';
	import { dateFormatter, monthYearFormatter } from './formatters';
	import { melt } from '$lib';

	export let mode: 'single' | 'multiple' | 'range' = 'single';
	export let disabled: Matcher | Matcher[] = false;
	export let activeDate: CreateDatePickerProps['activeDate'] = new Date();
	export let defaultValue: Date[] = [];
	export let numberOfMonths: CreateDatePickerProps['numberOfMonths'] = 1;
	export let pagedNavigation: CreateDatePickerProps['pagedNavigation'] = false;
	const {
		elements: {
			content,
			nextMonthButton,
			prevMonthButton,
			nextYearButton,
			prevYearButton,
			date,
			prevButton,
			nextButton,
		},
		states: { value, months },
		options: { mode: modeStore },
	} = createDatePicker({
		mode,
		allowDeselect: true,
		disabled,
		defaultValue,
		activeDate,
		numberOfMonths,
		pagedNavigation,
	});
</script>

<div class="flex flex-col">
	<div class="flex items-center justify-between">
		<button use:melt={$prevButton}>Prev</button>
		<button use:melt={$nextButton}>Next</button>
	</div>
	<div class="flex items-center gap-4">
		<!-- Calendar view -->
		{#each $months as month}
			{@const {
				dates,
				lastMonthDates,
				nextMonthDates,
				month: monthDate,
			} = month}
			<div>
				<div {...$content} use:content class="content">
					<div class="flex flex-col gap-2.5 text-magnum-800">
						<div class="text-magnum-800">
							{monthYearFormatter.format(monthDate)}
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
							{#each lastMonthDates as d}
								<button
									use:date
									{...$date({ label: d.toDateString(), value: d })}
									class="date"
								>
									<span class="">{d.getDate()}</span>
								</button>
							{/each}
							{#each dates as d}
								<button
									use:date
									{...$date({ label: d.toDateString(), value: d })}
									class="date"
								>
									<span class="">{d.getDate()}</span>
								</button>
							{/each}
							{#each nextMonthDates as d}
								<button
									use:date
									{...$date({ label: d.toDateString(), value: d })}
									class="date"
								>
									<span class="">{d.getDate()}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{#if $modeStore === 'range'}
		<div class="text-xs text-magnum-900">
			Selected Range:
			<p>
				{#if $value.length}
					{$value[0] && dateFormatter.format($value[0])} - {$value[1] &&
						dateFormatter.format($value[1])}
				{/if}
			</p>
		</div>
	{:else if $modeStore === 'single'}
		<div class="text-xs text-magnum-900">
			Selected Value:
			<p>
				{#if $value.length && $value[0]}
					{dateFormatter.format($value[0])}
				{/if}
			</p>
		</div>
	{:else if $modeStore === 'multiple'}
		<div class="text-xs text-magnum-900">
			Selected Value:
			{#each $value as v, i (i)}
				<p>
					{dateFormatter.format(v)}
				</p>
			{/each}
		</div>
	{/if}
</div>

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
