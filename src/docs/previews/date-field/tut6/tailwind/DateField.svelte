<script lang="ts">
	import { createDateField, melt, type CreateDateFieldProps } from '$lib';
	import { CalendarDate } from '@internationalized/date';

	export let defaultValue: CreateDateFieldProps['defaultValue'] = undefined;

	const {
		elements: { field, segment, label, hiddenInput },
		states: { value, segmentContents },
	} = createDateField({
		name: 'birthday',
		defaultPlaceholder: new CalendarDate(2023, 10, 11),
		defaultValue,
	});
</script>

<form method="POST">
	<div>
		<span use:melt={$label}>Your Birthday</span>
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
	[data-melt-field-label] {
		@apply font-medium text-magnum-900;
	}

	[data-melt-field] {
		@apply mt-0.5 flex w-full min-w-[200px] items-center rounded-lg border bg-white p-1.5 text-magnum-900;
	}

	[data-melt-field-segment]:not([data-segment='literal']) {
		@apply px-0.5;
	}
	[data-melt-field-segment] {
		@apply whitespace-nowrap data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}
</style>
