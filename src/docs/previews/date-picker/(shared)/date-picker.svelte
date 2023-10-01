<script lang="ts">
	import {
		createDatePicker,
		type CreateDatePickerProps,
		type Matcher,
	} from '$lib/builders';
	import { ChevronRight, ChevronLeft } from 'lucide-svelte';
	import { dateFormatter, monthYearFormatter } from './formatters';
	import { melt } from '$lib';
	import dayjs from 'dayjs';

	export let mode: 'single' | 'multiple' | 'range' = 'single';
	export let disabled: Matcher | Matcher[] = false;
	export let activeDate: CreateDatePickerProps['activeDate'] = new Date();
	export let defaultValue: CreateDatePickerProps["defaultValue"] = undefined
	export let numberOfMonths: CreateDatePickerProps['numberOfMonths'] = 1;
	export let pagedNavigation: CreateDatePickerProps['pagedNavigation'] = false;
	export let weekStartsOn: CreateDatePickerProps['weekStartsOn'] = 0;
	export let fixedWeeks: CreateDatePickerProps['fixedWeeks'] = false;

	const {
		elements: { content, date, prevButton, nextButton },
		states: { value, months, daysOfWeek },
		options: { mode: modeStore },
	} = createDatePicker({
		mode,
		allowDeselect: true,
		disabled,
		defaultValue,
		activeDate,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
	});
</script>

<div class="flex flex-col gap-3">
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
				<div
					{...$content}
					use:content
					class="w-80 rounded-lg bg-white p-4 shadow-sm"
				>
					<div class="flex flex-col gap-2.5 text-magnum-800">
						<div class="flex w-full items-center justify-between">
							<p class="font-semibold text-magnum-800">
								{monthYearFormatter.format(monthDate)}
							</p>
							<div class="flex items-center gap-8">
								<button use:melt={$prevButton}>
									<ChevronLeft />
								</button>
								<button use:melt={$nextButton}>
									<ChevronRight />
								</button>
							</div>
						</div>
						<div class="grid grid-cols-7 gap-2">
							{#each $daysOfWeek as day}
								<div class="date">
									<span class="text-sm font-medium"
										>{dayjs(day).format('dd')}</span
									>
								</div>
							{/each}
							{#each lastMonthDates as day}
								<button
									use:date
									{...$date({ label: day.toDateString(), value: day })}
									class="date"
								>
									<span class="opacity-50">{day.getDate()}</span>
								</button>
							{/each}
							{#each dates as day}
								<button
									use:date
									{...$date({ label: day.toDateString(), value: day })}
									class="date"
								>
									<span class="">{day.getDate()}</span>
								</button>
							{/each}
							{#each nextMonthDates as day}
								<button
									use:date
									{...$date({ label: day.toDateString(), value: day })}
									class="date"
								>
									<span class="opacity-50">{day.getDate()}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{#if $value}
		{#if $modeStore === 'range'}
			<div class="flex flex-col text-xs text-magnum-900">
				<div>You selected:</div>
				<div>
					{#if 'to' in $value && 'from' in $value}
						{$value.from && dateFormatter.format($value.from)} - {$value.to &&
							dateFormatter.format($value.to)}
					{/if}
				</div>
			</div>
		{:else if $modeStore === 'single'}
			<div class="flex flex-col text-xs text-magnum-900">
				<div>You selected:</div>
				<div>
					{#if $value instanceof Date}
						{dateFormatter.format($value)}
					{/if}
				</div>
			</div>
		{:else if $modeStore === 'multiple'}
			<div class="flex flex-col text-xs text-magnum-900">
				<div>You selected:</div>
				{#if Array.isArray($value)}
					{#each $value as v, i (i)}
						<div>
							{dateFormatter.format(v)}
						</div>
					{/each}
				{/if}
			</div>
		{/if}
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
		@apply flex h-6 w-6 items-center justify-center rounded p-4 hover:bg-magnum-100 data-[selected]:bg-magnum-200 data-[disabled]:opacity-40;
	}

	.date span {
		@apply text-magnum-800;
	}
</style>
