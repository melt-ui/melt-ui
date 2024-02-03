<script lang="ts">
	import { createDateRangeField, melt } from '$lib/index.js';
	import LocaleCombobox from './LocaleCombobox.svelte';

	const {
		elements: { field, startSegment, endSegment, label },
		states: { segmentContents },
		options: { locale },
	} = createDateRangeField();
</script>

<section>
	<LocaleCombobox
		onSelectedChange={({ next }) => {
			if (next) {
				locale.set(next.value);
			}
			return next;
		}}
	/>
	<div>
		<span use:melt={$label}>Booking Dates</span>
		<div use:melt={$field}>
			{#key $locale}
				{#each $segmentContents.start as seg, i (i)}
					<div use:melt={$startSegment(seg.part)}>
						{seg.value}
					</div>
				{/each}
				<span aria-hidden="true">-</span>
				{#each $segmentContents.end as seg, i (i)}
					<div use:melt={$endSegment(seg.part)}>
						{seg.value}
					</div>
				{/each}
			{/key}
		</div>
	</div>
</section>

<style lang="postcss">
	section {
		@apply flex w-full flex-col items-center gap-3;
	}

	[data-melt-datefield-label] {
		@apply select-none font-medium text-magnum-800;
	}

	[data-melt-datefield-label][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-field] {
		@apply mt-0.5 flex w-full min-w-[160px] items-center rounded-lg border border-magnum-400/60 bg-white p-1.5 text-magnum-800 shadow-md;
	}
	[data-melt-datefield-field] span {
		@apply px-2;
	}

	[data-melt-datefield-field][data-invalid] {
		@apply border-2 border-red-600;
	}

	[data-melt-datefield-field][data-invalid] {
		@apply text-red-600;
	}

	[data-melt-datefield-segment]:not([data-segment='literal']) {
		@apply px-0.5;
	}

	[data-melt-datefield-validation] {
		@apply self-start text-red-500;
	}
</style>
