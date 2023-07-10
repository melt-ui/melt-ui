<script lang="ts">
	import { createPopover } from '@melt-ui/svelte';
	import { createDatePicker } from '@melt-ui/svelte/builders/datepicker';
	import { fade } from 'svelte/transition';
	import Settings2 from '~icons/lucide/settings2';
	import X from '~icons/lucide/x';
	import ChevronRight from '~icons/lucide/chevron-right';
	import ChevronLeft from '~icons/lucide/chevron-left';
	import ChevronsRight from '~icons/lucide/chevrons-right';
	import ChevronsLeft from '~icons/lucide/chevrons-left';
	import { dateFormatter } from './formatters';

	const {
		trigger,
		content,
		open,
		arrow,
		close,
		value,
		activeDate,
		nextMonth,
		prevMonth,
		nextYear,
		prevYear,
		dates,
		date,
		lastMonthDates,
		nextMonthDates,
	} = createDatePicker({
		type: 'range',
	});
</script>

<button type="button" class="trigger" {...$trigger} use:trigger aria-label="Update dimensions">
	<span class="">{dateFormatter.format($value[0])}</span>
</button>

{#if $open}
	<div {...$content} use:content transition:fade={{ duration: 100 }} class="content">
		<div {...$arrow} />
		<div class="flex flex-col gap-2.5 text-magnum-800">
			<div class="text-magnum-800">{dateFormatter.format($value[0] || new Date())}</div>
			<div class="buttons-wrapper">
				<div class="flex items-center space-x-2">
					<button {...$prevYear} use:prevYear class="button">
						<ChevronsLeft />
					</button>
					<button {...$prevMonth} use:prevMonth class="button">
						<ChevronLeft />
					</button>
				</div>
				<div class="flex items-center space-x-2">
					<button {...$nextMonth} use:nextMonth class="button">
						<ChevronRight />
					</button>
					<button {...$nextYear} use:nextYear class="button">
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
		<button class="close" {...$close} use:close>
			<X class="h-4 w-4 " />
		</button>
	</div>
{/if}

<style lang="postcss">
	fieldset {
		@apply flex items-center gap-5;
	}

	label {
		@apply w-[75px] text-sm text-neutral-700;
	}

	p {
		@apply mb-2 font-medium text-neutral-900;
	}

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
