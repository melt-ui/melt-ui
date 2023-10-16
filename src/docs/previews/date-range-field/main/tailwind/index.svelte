<script lang="ts">
	import { createDateRangeField, melt } from '$lib';

	const {
		elements: { field, startSegment, endSegment, label },
		states: { segmentContents, isInvalid },
	} = createDateRangeField();
</script>

<div class="flex w-full flex-col items-center gap-3">
	<div>
		<span use:melt={$label} class="pb-1 font-medium text-magnum-800"
			>Booking Dates</span
		>
		<div
			use:melt={$field}
			class="flex w-[260px] items-center justify-center rounded-md border bg-white p-1.5 text-magnum-800 {$isInvalid &&
				'border-2 border-red-600'}"
		>
			{#each $segmentContents.start as seg, i (i)}
				<div
					use:melt={$startSegment(seg.part)}
					class="segment {$isInvalid && 'text-red-600'}"
				>
					{seg.value}
				</div>
			{/each}
			<div aria-hidden="true" class="px-2">-</div>
			{#each $segmentContents.end as seg, i (i)}
				<div
					use:melt={$endSegment(seg.part)}
					class="segment {$isInvalid && 'text-red-600'}"
				>
					{seg.value}
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	.segment:not([data-segment='literal']) {
		@apply px-0.5;
	}
	.segment {
		@apply whitespace-nowrap data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
