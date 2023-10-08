<script lang="ts">
	import { createDateField } from '$lib/builders';
	import { melt } from '$lib';

	const {
		elements: { dateField, segment },
		states: { value, segmentContents },
		options: { locale },
	} = createDateField({
		granularity: 'minute',
	});

	function getDayOfWeek(date: Date) {
		return new Intl.DateTimeFormat($locale, { weekday: 'narrow' }).format(date);
	}
</script>

<div class="flex w-full flex-col items-center gap-3">
	<div class="flex items-center gap-2">
		<button class="btn" on:click={() => locale.set('en')}>EN</button>
		<button class="btn" on:click={() => locale.set('en-UK')}>EN-UK</button>
	</div>
	<div class="flex w-full items-center justify-center">
		<p class="text-xs">{$value}</p>
	</div>
	<div
		use:melt={$dateField}
		class="flex w-full max-w-[300px] items-center rounded-md border bg-white p-1.5 text-magnum-800"
	>
		{#each $segmentContents.arr as seg, i (`${i}-${$locale}`)}
			<div use:melt={$segment(seg.part)} class="segment whitespace-nowrap">
				{seg.value}
			</div>
		{/each}
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
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded p-4 hover:bg-magnum-100 focus:ring focus:ring-magnum-400 data-[outside-month]:pointer-events-none data-[outside-month]:cursor-default data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-300 data-[disabled]:opacity-40 data-[outside-month]:opacity-40 data-[outside-month]:hover:bg-transparent;
	}

	.segment {
		@apply data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
