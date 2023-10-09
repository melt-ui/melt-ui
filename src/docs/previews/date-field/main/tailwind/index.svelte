<script lang="ts">
	import { createDateField } from '$lib/builders';
	import { melt } from '$lib';
	import { getLocalTimeZone, now } from '@internationalized/date';

	const {
		elements: { dateField, segment, label },
		states: { value, segmentContents },
	} = createDateField({});
</script>

<div class="flex w-full flex-col items-center gap-3">
	<div class="flex w-full items-center justify-center">
		<p class="text-xs">{$value}</p>
	</div>
	<div>
		<span use:melt={$label} class="text-magnum-800">Date</span>
		<div
			use:melt={$dateField}
			class="flex w-full max-w-[300px] items-center rounded-md border bg-white p-1.5 text-magnum-800"
		>
			{#each $segmentContents.arr as seg, i (i)}
				<div use:melt={$segment(seg.part)} class="segment whitespace-nowrap">
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
		@apply data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
