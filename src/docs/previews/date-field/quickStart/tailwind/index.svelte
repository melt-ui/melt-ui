<script lang="ts">
	import { createDateField, melt } from '$lib';

	const {
		elements: { dateField, segment, label, hiddenInput },
		states: { value, segmentContents },
	} = createDateField({
		name: 'appointmentName',
	});
</script>

<form>
	<div>
		<span use:melt={$label}>Appointment Date</span>
		<div use:melt={$dateField} class="">
			{#each $segmentContents as seg, i (i)}
				<div use:melt={$segment(seg.part)}>
					{seg.value}
				</div>
			{/each}
		</div>
		<input use:melt={$hiddenInput} />
	</div>
	{#if $value}
		<p>
			You Selected: {$value}
		</p>
	{/if}
</form>

<style lang="postcss">
	[data-melt-dateField-label] {
		@apply font-medium text-magnum-900;
	}

	[data-melt-dateField] {
		@apply mt-0.5 flex w-full min-w-[200px] items-center rounded-lg border bg-white p-1.5 text-magnum-900;
	}

	form {
		@apply flex w-full flex-col items-center gap-3;
	}

	p {
		@apply text-sm font-medium text-magnum-900;
	}

	[data-melt-dateField-segment]:not([data-segment='literal']) {
		@apply px-0.5;
	}
	[data-melt-dateField-segment] {
		@apply whitespace-nowrap data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
