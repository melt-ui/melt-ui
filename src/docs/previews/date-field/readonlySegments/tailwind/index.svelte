<script lang="ts">
	import { createDateField, melt } from '$lib';
	import { CalendarDate } from '@internationalized/date';

	const {
		elements: { field, segment, label },
		states: { segmentContents },
	} = createDateField({
		defaultValue: new CalendarDate(2023, 10, 11),
		readonlySegments: ['year'],
	});
</script>

<div>
	<div>
		<span use:melt={$label}>Appointment Date</span>
		<div use:melt={$field}>
			{#each $segmentContents as seg, i (i)}
				<div use:melt={$segment(seg.part)}>
					{seg.value}
				</div>
			{/each}
		</div>
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
		@apply mt-1.5 flex w-full min-w-[200px] items-center rounded-lg border border-magnum-400/60 bg-neutral-800/80 p-1.5 text-magnum-400;
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
