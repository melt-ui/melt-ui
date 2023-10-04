<script lang="ts">
	import {
		createDatePicker,
		type CreateDatePickerProps,
		type Matcher,
	} from '$lib/builders';
	import { ChevronRight, ChevronLeft, Calendar } from 'lucide-svelte';
	import { monthYearFormatter } from './formatters';
	import dayjs from 'dayjs';
	import { melt } from '$lib';
	import { fade } from 'svelte/transition';

	export let disabled: Matcher | Matcher[] = false;
	export let defaultFocusedValue: CreateDatePickerProps['defaultFocusedValue'] =
		undefined;
	export let defaultValue: CreateDatePickerProps['defaultValue'] = new Date();
	export let numberOfMonths: CreateDatePickerProps['numberOfMonths'] = 1;
	export let pagedNavigation: CreateDatePickerProps['pagedNavigation'] = false;
	export let weekStartsOn: CreateDatePickerProps['weekStartsOn'] = 0;
	export let fixedWeeks: CreateDatePickerProps['fixedWeeks'] = false;

	const {
		elements: {
			calendar,
			grid,
			cell,
			dateInput,
			dayPeriodSegment,
			segment,
			trigger,
			content,
		},
		states: {
			value,
			months,
			daysOfWeek,
			segmentContents,
			dayPeriodValue,
			open,
		},
		helpers: { prevMonth, nextMonth },
	} = createDatePicker({
		allowDeselect: true,
		disabled,
		defaultValue,
		defaultFocusedValue,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
		hourCycle: 12,
		forceVisible: true,
		locale: 'de',
	});

	function getDayOfWeek(date: Date) {
		return dayjs(date).format('dd');
	}
</script>

<div class="flex flex-col gap-3">
	<p class="text-xs">{$value}</p>
	<div
		use:melt={$dateInput}
		class="flex max-w-[300px] items-center rounded-md border bg-white p-1.5 text-magnum-800"
	>
		<div use:melt={$segment('month')}>
			{$segmentContents.month}
		</div>
		<div aria-hidden="true" class="px-1">/</div>
		<div use:melt={$segment('day')}>
			{$segmentContents.day}
		</div>
		<div aria-hidden="true" class="px-1">/</div>
		<div use:melt={$segment('year')}>
			{$segmentContents.year}
		</div>
		<div aria-hidden="true" class="pr-2">,</div>
		<div use:melt={$segment('hour')} class="whitespace-nowrap">
			{$segmentContents.hour}
		</div>
		<div aria-hidden="true" class="px-0.5">:</div>
		<div use:melt={$segment('minute')} class="whitespace-nowrap">
			{$segmentContents.minute}
		</div>
		<div aria-hidden="true" class="px-0.5">:</div>
		<div use:melt={$segment('second')} class="whitespace-nowrap">
			{$segmentContents.second}
		</div>
		<div use:melt={$dayPeriodSegment} class="ml-2">
			{$dayPeriodValue}
		</div>
		<div class="ml-4 flex w-full items-center justify-end">
			<button use:melt={$trigger} class="rounded bg-magnum-800 p-1">
				<Calendar class="h-4 w-4 text-white" />
			</button>
		</div>
	</div>
	{#if $open}
		<div
			class="z-10 w-80 rounded-[4px] bg-white p-3 shadow-sm"
			use:melt={$content}
			transition:fade={{ duration: 100 }}
		>
			<div class="w-full" use:melt={$calendar}>
				<table class="flex items-center gap-4">
					<!-- Calendar view -->
					{#each $months as month}
						{@const { weeks, monthDate } = month}
						<div use:melt={$grid} class="rounded-lg bg-white p-4 shadow-sm">
							<div class="flex flex-col gap-2.5 text-magnum-800">
								<div class="flex w-full items-center justify-between">
									<p class="font-semibold text-magnum-800">
										{monthYearFormatter.format(monthDate)}
									</p>
									<div class="flex items-center gap-8">
										<button on:click={prevMonth} tabindex={1}>
											<ChevronLeft />
										</button>
										<button on:click={nextMonth} tabindex={2}>
											<ChevronRight />
										</button>
									</div>
								</div>
								<div class="grid grid-cols-7 gap-2">
									{#each $daysOfWeek as day}
										<div class="cell">
											<span class="text-sm font-medium"
												>{getDayOfWeek(day)}</span
											>
										</div>
									{/each}
									{#each lastMonthDates as day}
										<div
											use:melt={$cell({
												label: day.toDateString(),
												value: day,
											})}
											class="cell"
										>
											<span class="opacity-50">{day.getDate()}</span>
										</div>
									{/each}
									{#each dates as day}
										<div
											use:melt={$cell({
												label: day.toDateString(),
												value: day,
											})}
											class="cell"
										>
											<span class="">{day.getDate()}</span>
										</div>
									{/each}
									{#each nextMonthDates as day}
										<div
											use:melt={$cell({
												label: day.toDateString(),
												value: day,
											})}
											class="cell"
										>
											<span class="opacity-50">{day.getDate()}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</table>
			</div>
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

	.cell {
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded p-4 hover:bg-magnum-100 focus:ring focus:ring-magnum-400 data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-200 data-[disabled]:opacity-40;
	}

	.cell span {
		@apply text-magnum-800;
	}
</style>
