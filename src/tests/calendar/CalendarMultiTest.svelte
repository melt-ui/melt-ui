<script lang="ts">
	import { createCalendar, melt, type CreateCalendarProps } from '$lib/index.js';
	import { ChevronRight, ChevronLeft } from 'lucide-svelte';
	import { removeUndefined } from '../utils.js';

	type CalendarProps = CreateCalendarProps<true>;

	export let value: CalendarProps['value'] = undefined;
	export let defaultValue: CalendarProps['defaultValue'] = undefined;
	export let defaultPlaceholder: CalendarProps['defaultPlaceholder'] = undefined;
	export let onValueChange: CalendarProps['onValueChange'] = undefined;
	export let onPlaceholderChange: CalendarProps['onPlaceholderChange'] = undefined;
	export let isDateUnavailable: CalendarProps['isDateUnavailable'] = undefined;
	export let isDateDisabled: CalendarProps['isDateDisabled'] = undefined;
	export let locale: CalendarProps['locale'] = 'en';
	export let calendarLabel: CalendarProps['calendarLabel'] = undefined;
	export let preventDeselect: CalendarProps['preventDeselect'] = undefined;
	export let numberOfMonths: CalendarProps['numberOfMonths'] = undefined;
	export let pagedNavigation: CalendarProps['pagedNavigation'] = undefined;
	export let placeholder: CalendarProps['placeholder'] = undefined;
	export let weekStartsOn: CalendarProps['weekStartsOn'] = undefined;
	export let fixedWeeks: CalendarProps['fixedWeeks'] = undefined;
	export let minValue: CalendarProps['minValue'] = undefined;
	export let maxValue: CalendarProps['maxValue'] = undefined;
	export let weekdayFormat: CalendarProps['weekdayFormat'] = undefined;

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { value: insideValue, months, headingValue, weekdays },
	} = createCalendar(
		removeUndefined({
			value,
			defaultValue,
			defaultPlaceholder,
			onValueChange,
			onPlaceholderChange,
			isDateUnavailable,
			isDateDisabled,
			locale,
			calendarLabel,
			preventDeselect,
			numberOfMonths,
			pagedNavigation,
			placeholder,
			weekStartsOn,
			fixedWeeks,
			minValue,
			maxValue,
			multiple: true,
			weekdayFormat,
		})
	);
</script>

<main class="flex h-full">
	<div class="flex w-full flex-col items-center gap-3">
		<div class="flex w-full items-center justify-center">
			<p class="text-xs" data-testid="inside-value">{$insideValue}</p>
		</div>

		<div class="z-10 w-80 rounded-[4px] bg-white p-3 shadow-sm">
			<div class="w-full text-magnum-800" use:melt={$calendar} data-testid="calendar">
				<header class="flex items-center justify-between pb-4">
					<button use:melt={$prevButton} data-testid="prev-button">
						<ChevronLeft />
					</button>
					<h2 class="font-semibold text-magnum-800" use:melt={$heading} data-testid="heading">
						{$headingValue}
					</h2>
					<button use:melt={$nextButton} data-testid="next-button">
						<ChevronRight />
					</button>
				</header>
				{#each $months as month, i (i)}
					{@const { weeks } = month}
					<table use:melt={$grid} class="w-full" data-testid="grid-{i}">
						<thead aria-hidden="true">
							<tr>
								{#each $weekdays as day, idx}
									<th class="text-sm font-semibold text-magnum-800">
										<div
											class="flex h-6 w-6 items-center justify-center p-4"
											data-testid="day-of-week-{idx}"
										>
											{day}
										</div>
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each weeks as days, idx}
								<tr data-testid="week-{idx + 1}">
									{#each days as date}
										<td role="gridcell">
											<div
												use:melt={$cell(date, month.value)}
												class="cell"
												data-testid="month-{date.month}-date-{date.day}"
											>
												{date.day}
											</div>
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				{/each}
			</div>
		</div>
	</div>
</main>

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
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded p-4 hover:bg-magnum-100 focus:ring focus:ring-magnum-400 data-[outside-month]:pointer-events-none data-[outside-month]:cursor-default data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-300 data-[disabled]:opacity-40 data-[outside-month]:opacity-40 data-[outside-month]:hover:bg-transparent;
	}

	.segment {
		@apply data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
