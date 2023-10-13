<script lang="ts">
	import { createDateField, melt } from '$lib';

	const {
		elements: { field, segment, label, hiddenInput },
		states: { value, segmentContents },
	} = createDateField({
		name: 'appointmentDate',
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
		@apply w-full text-left text-sm font-medium text-magnum-900;
	}
	[data-melt-datefield-label] {
		@apply font-medium text-magnum-900;
	}

	[data-melt-datefield-field] {
		@apply mt-0.5 flex w-full min-w-[200px] items-center rounded-lg border bg-white p-1.5 text-magnum-900;
	}

	[data-melt-datefield-segment]:not([data-segment='literal']) {
		@apply px-0.5;
	}
	[data-melt-datefield-segment] {
		@apply whitespace-nowrap data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	[data-melt-datefield-label] {
		@apply font-medium text-magnum-900;
	}

	[data-melt-datefield-field] {
		@apply mt-0.5 flex w-full min-w-[200px] items-center rounded-lg border bg-white p-1.5 text-magnum-900;
	}

	[data-melt-datefield-segment]:not([data-segment='literal']) {
		@apply px-0.5;
	}
	[data-melt-datefield-segment] {
		@apply whitespace-nowrap data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}
</style>
