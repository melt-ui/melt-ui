<script lang="ts">
	import { createDateRangeField, melt } from '$lib';
	import { now } from '@internationalized/date';

	const {
		elements: { field, startSegment, endSegment, label },
		states: { segmentContents },
	} = createDateRangeField({
		defaultPlaceholder: now('America/Los_Angeles'),
	});
</script>

<span use:melt={$label}>Trip Dates</span>
<div use:melt={$field}>
	<div>
		{#each $segmentContents.start as seg, i (i)}
			<div use:melt={$startSegment(seg.part)}>
				{seg.value}
			</div>
		{/each}
	</div>
	<div aria-hidden="true">-</div>
	<div>
		{#each $segmentContents.end as seg, i (i)}
			<div use:melt={$endSegment(seg.part)}>
				{seg.value}
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	[data-melt-datefield-label] {
		@apply select-none font-medium text-white;
	}

	[data-melt-datefield-label][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-field] {
		@apply mt-1.5 flex w-full min-w-[300px]  items-center justify-center gap-2 rounded-lg border border-magnum-400/60 bg-neutral-800/80 p-1.5 text-magnum-400;

		& > div {
			@apply flex items-center;
		}
	}

	[data-melt-datefield-field][data-invalid] {
		@apply border-red-400;
	}

	[data-melt-datefield-segment][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-segment]:not([data-segment='literal']) {
		@apply px-0.5;
	}

	[data-melt-datefield-validation] {
		@apply self-start text-red-500;
	}
</style>
