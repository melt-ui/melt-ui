<script lang="ts">
	import {
		createDateRangeField,
		melt,
		type CreateDateRangeFieldProps,
	} from '$lib';
	import { CalendarDateTime } from '@internationalized/date';

	export let locale: CreateDateRangeFieldProps['locale'] = 'en-US';

	const {
		elements: { field, startSegment, endSegment, label },
		states: { segmentContents },
	} = createDateRangeField({
		defaultPlaceholder: new CalendarDateTime(2023, 10, 11),
		locale,
	});
</script>

<div>
	<span use:melt={$label}>Availability</span>
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
</div>

<style lang="postcss">
	[data-melt-datefield-label] {
		@apply font-medium text-white;
	}

	[data-melt-datefield-label][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-field] {
		@apply mt-1.5 flex w-full min-w-[200px] items-center gap-2 rounded-lg border border-magnum-400/60 bg-neutral-800/80 p-1.5 text-magnum-400;

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
