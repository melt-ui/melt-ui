<script lang="ts">
	import { createDateField, melt, type Matcher } from '$lib';
	import { CalendarDate } from '@internationalized/date';

	const isFirstOrFifteenth: Matcher = (date) => {
		return date.day === 1 || date.day === 15;
	};

	const {
		elements: { field, segment, label, hiddenInput, validation },
		states: { segmentContents },
	} = createDateField({
		name: 'appointmentDate',
		defaultValue: new CalendarDate(2023, 10, 14),
		isDateUnavailable: isFirstOrFifteenth,
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
</form>

<style lang="postcss">
	form {
		@apply flex w-full flex-col items-center gap-3;
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
