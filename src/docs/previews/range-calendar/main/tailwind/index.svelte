<script lang="ts">
	import { ChevronRight, ChevronLeft } from 'lucide-svelte';
	import { melt } from '$lib';
	import { createRangeCalendar } from '$lib/builders/range-calendar';

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { value, months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable },
	} = createRangeCalendar({
		allowDeselect: true,
		isDisabled: (date) => date.day === 15,
	});
</script>

<div class="flex h-full">
	<div class="flex w-full flex-col items-center gap-3">
		<div class="flex w-full items-center justify-center">
			<p class="text-xs">{$value.start} - {$value.end}</p>
		</div>

		<div class="z-10 w-80 rounded-[4px] bg-white p-3 shadow-sm">
			<div class="w-full text-magnum-800" use:melt={$calendar}>
				<header class="flex items-center justify-between pb-4">
					<button use:melt={$prevButton}>
						<ChevronLeft />
					</button>
					<h2 class="font-semibold text-magnum-800" use:melt={$heading}>
						{$headingValue}
					</h2>
					<button use:melt={$nextButton}>
						<ChevronRight />
					</button>
				</header>
				{#each $months as month}
					<table use:melt={$grid} class="w-full">
						<thead aria-hidden="true">
							<tr>
								{#each $daysOfWeek as day}
									<th class="text-sm font-semibold text-magnum-800">
										<div class="flex h-6 w-6 items-center justify-center p-4">
											{day}
										</div>
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each month.weeks as dates}
								<tr>
									{#each dates as date}
										<td
											role="gridcell"
											aria-disabled={$isDateDisabled(date) ||
												$isDateUnavailable(date)}
											class="my-1"
										>
											<div use:melt={$cell(date, month.value)} class="cell">
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
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded p-4 hover:bg-magnum-100 focus:ring focus:ring-magnum-400 data-[outside-month]:pointer-events-none data-[outside-month]:cursor-default data-[highlighted]:bg-magnum-200 data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-300 data-[disabled]:opacity-40 data-[outside-month]:opacity-40 data-[outside-month]:hover:bg-transparent;
	}

	.segment {
		@apply data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
