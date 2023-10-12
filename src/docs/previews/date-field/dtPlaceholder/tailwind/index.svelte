<script lang="ts">
	import { createDateField, melt } from '$lib';
	import { CalendarDateTime } from '@internationalized/date';

	const {
		elements: { dateField, segment, label },
		states: { value, segmentContents },
	} = createDateField({
		defaultPlaceholderValue: new CalendarDateTime(2023, 10, 11, 12, 30),
	});
</script>

<div class="flex w-full flex-col items-center gap-3">
	<div>
		<span use:melt={$label} class="font-medium text-magnum-900"
			>Appointment Date</span
		>
		<div
			use:melt={$dateField}
			class="mt-0.5 flex w-full min-w-[200px] items-center rounded-lg border bg-white p-1.5 text-magnum-900"
		>
			{#each $segmentContents as seg, i (i)}
				<div use:melt={$segment(seg.part)} class="segment whitespace-nowrap">
					{seg.value}
				</div>
			{/each}
		</div>
	</div>
	<div class="flex w-full">
		<p class="text-sm font-medium text-magnum-900">
			<span> Selected Date: </span>
			{#if $value}
				{$value}
			{/if}
		</p>
	</div>
</div>

<style lang="postcss">
	.segment:not([data-segment='literal']) {
		@apply px-0.5;
	}
	.segment {
		@apply data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
