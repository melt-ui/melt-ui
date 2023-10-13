<script lang="ts">
	import { createDateField, melt, type Matcher } from '$lib';
	import { CalendarDate } from '@internationalized/date';

	const isFirstOrFifteenth: Matcher = (date) => {
		return date.day === 1 || date.day === 15;
	};

	const {
		elements: { field, segment, label, hiddenInput, validation },
		states: { value, segmentContents, isInvalid },
	} = createDateField({
		name: 'appointmentDate',
		defaultValue: new CalendarDate(2023, 10, 14),
		isUnavailable: isFirstOrFifteenth,
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
	<small use:melt={$validation}
		>Date must not be the 1st or 15th of the month.</small
	>

	{#if !$isInvalid}
		<p>
			You Selected:
			{#if $value}
				{$value}
			{/if}
		</p>
	{/if}
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

	[data-melt-datefield-label][data-invalid] {
		@apply text-red-700;
	}

	[data-melt-datefield-field] {
		@apply mt-0.5 flex w-full min-w-[200px] items-center rounded-lg border bg-white p-1.5 text-magnum-900;
	}

	[data-melt-datefield][data-invalid] {
		@apply border-2 border-red-700;
	}

	[data-melt-datefield-segment]:not([data-segment='literal']) {
		@apply px-0.5;
	}
	[data-melt-datefield-segment] {
		@apply whitespace-nowrap data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	[data-melt-datefield-validation] {
		@apply text-red-700;
	}
</style>
