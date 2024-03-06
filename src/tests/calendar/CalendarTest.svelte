<script lang="ts">
	import { createCalendar, type CreateCalendarProps } from '$lib/builders/index.js';
	import { ChevronRight, ChevronLeft } from '$icons/index.js';
	import { melt } from '$lib/index.js';
	import { removeUndefined } from '../utils.js';

	export let value: CreateCalendarProps['value'] = undefined;
	export let defaultValue: CreateCalendarProps['defaultValue'] = undefined;
	export let defaultPlaceholder: CreateCalendarProps['defaultPlaceholder'] = undefined;
	export let onValueChange: CreateCalendarProps['onValueChange'] = undefined;
	export let onPlaceholderChange: CreateCalendarProps['onPlaceholderChange'] = undefined;
	export let isDateUnavailable: CreateCalendarProps['isDateUnavailable'] = undefined;
	export let isDateDisabled: CreateCalendarProps['isDateDisabled'] = undefined;
	export let locale: CreateCalendarProps['locale'] = 'en';
	export let calendarLabel: CreateCalendarProps['calendarLabel'] = undefined;
	export let preventDeselect: CreateCalendarProps['preventDeselect'] = undefined;
	export let numberOfMonths: CreateCalendarProps['numberOfMonths'] = undefined;
	export let pagedNavigation: CreateCalendarProps['pagedNavigation'] = undefined;
	export let placeholder: CreateCalendarProps['placeholder'] = undefined;
	export let weekStartsOn: CreateCalendarProps['weekStartsOn'] = undefined;
	export let fixedWeeks: CreateCalendarProps['fixedWeeks'] = undefined;
	export let minValue: CreateCalendarProps['minValue'] = undefined;
	export let maxValue: CreateCalendarProps['maxValue'] = undefined;
	export let multiple: boolean | undefined = undefined;
	export let disabled: CreateCalendarProps['disabled'] = undefined;
	export let readonly: CreateCalendarProps['readonly'] = undefined;
	export let weekdayFormat: CreateCalendarProps['weekdayFormat'] = undefined;
	export let ids: CreateCalendarProps['ids'] = undefined;

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { value: insideValue, months, headingValue, weekdays },
		options: {
			weekdayFormat: weekdayFormatOption,
			numberOfMonths: numberOfMonthsOption,
			fixedWeeks: fixedWeeksOption,
			weekStartsOn: weekStartsOnOption,
		},
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
			multiple,
			disabled,
			readonly,
			weekdayFormat,
			ids,
		})
	);

	function cycleWeekdayFormat() {
		weekdayFormatOption.update((prev) => {
			switch (prev) {
				case 'narrow':
					return 'short';
				case 'short':
					return 'long';
				case 'long':
					return 'short';
			}
		});
	}
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
				<div>
					{#each $months as month, i}
						<table use:melt={$grid} class="w-full" data-testid="grid-{i}">
							<thead aria-hidden="true">
								<tr data-testid="weekdays">
									{#each $weekdays as day, idx}
										<th class="text-sm font-semibold text-magnum-800">
											<div
												class="flex h-6 w-6 items-center justify-center p-4"
												data-testid="weekday-{idx}"
											>
												{day}
											</div>
										</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each month.weeks as days, idx}
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
	</div>
	<button on:click={cycleWeekdayFormat} data-testid="cycle-weekday-format">
		Cycle weekdayFormat
	</button>
	<button
		data-testid="numberOfMonths"
		on:click={() => {
			$numberOfMonthsOption++;
		}}>numberOfMonths</button
	>
	<br />
	<button
		data-testid="weekStartsOn"
		on:click={() => {
			$weekStartsOnOption = ($weekStartsOnOption + 1) % 7;
		}}>weekStartsOn</button
	>
	<br />
	<button
		data-testid="fixedWeeks"
		on:click={() => {
			$fixedWeeksOption = !$fixedWeeksOption;
		}}>fixedWeeksOption</button
	>
</main>

<style lang="postcss">
	[data-melt-calendar] {
		@apply w-full rounded-lg bg-white p-3 text-magnum-800 shadow-sm;
	}

	header {
		@apply flex items-center justify-between pb-2;
	}

	header + div {
		@apply flex items-center gap-8;
	}

	[data-melt-calendar-prevbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-magnum-100;
	}

	[data-melt-calendar-nextbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-magnum-100;
	}

	[data-melt-calendar-heading] {
		@apply font-semibold text-magnum-800;
	}

	th {
		@apply text-sm font-semibold text-magnum-800;

		& div {
			@apply flex h-6 w-6 items-center justify-center p-4;
		}
	}

	[data-melt-calendar-grid] {
		@apply w-full;
	}

	[data-melt-calendar-cell] {
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-lg p-4 hover:bg-magnum-100 focus:ring focus:ring-magnum-400 data-[outside-visible-months]:pointer-events-none data-[outside-visible-months]:cursor-default data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-300 data-[selected]:text-magnum-900 data-[disabled]:opacity-40 data-[outside-visible-months]:opacity-40 data-[outside-visible-months]:hover:bg-transparent;
	}

	[data-melt-calendar-cell][data-outside-month='true'][data-outside-visible-months='true'] {
		@apply opacity-0;
	}
</style>
