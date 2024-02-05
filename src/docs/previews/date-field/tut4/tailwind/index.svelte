<script lang="ts">
	import { createDateField, melt } from '$lib/index.js';
	import { now } from '@internationalized/date';

	const {
		elements: { field, segment, label, hiddenInput },
		states: { value, segmentContents },
	} = createDateField({
		name: 'appointmentDate',
		defaultPlaceholder: now('America/Los_Angeles'),
	});
</script>

<form method="POST">
	<div>
		<span use:melt={$label}>Appointment Date</span>
		<div use:melt={$field} class="">
			{#each $segmentContents as seg, i (i)}
				<div use:melt={$segment(seg.part)}>
					{seg.value}
				</div>
			{/each}
		</div>
		<input use:melt={$hiddenInput} />
	</div>
	<p>
		You Selected:
		{#if $value}
			{$value}
		{/if}
	</p>
</form>

<style lang="postcss">
	form {
		@apply flex w-full flex-col items-center gap-3;
	}

	p {
		@apply w-full text-left text-sm font-medium text-neutral-200;
	}

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
