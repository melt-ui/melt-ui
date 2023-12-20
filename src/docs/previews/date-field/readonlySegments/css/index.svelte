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

<style>
	[data-melt-datefield-label] {
		user-select: none;
		font-weight: 500;
		color: rgb(var(--color-white) / 1);
	}

	[data-melt-datefield-label][data-invalid] {
		color: rgb(var(--color-magnum-500) / 1);
	}

	[data-melt-datefield-field] {
		width: 100%;
		min-width: 200px;
		margin-top: 0.375rem;
		padding: 0.375rem;

		display: flex;
		align-items: center;

		background-color: rgb(var(--color-neutral-800) / 0.8);
		color: rgb(var(--color-magnum-400) / 1);
		border: 1px solid rgb(var(--color-magnum-400) / 0.6);
		border-radius: 0.5rem;
	}

	[data-melt-datefield-field][data-invalid] {
		border: 1px solid rgb(var(--color-magnum-400) / 0.6);
	}

	[data-melt-datefield-segment][data-invalid] {
		color: rgb(var(--color-magnum-500) / 1);
	}

	[data-melt-datefield-segment]:not([data-segment='literal']) {
		padding: 0 0.125rem;
	}

	[data-melt-datefield-validation] {
		align-self: self-start;
		color: rgb(var(--color-magnum-500) / 1);
	}
</style>
