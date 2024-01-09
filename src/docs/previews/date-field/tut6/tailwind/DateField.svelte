<script lang="ts">
	import { createDateField, melt, type CreateDateFieldProps } from '$lib';
	import { CalendarDate } from '@internationalized/date';

	export let defaultValue: CreateDateFieldProps['defaultValue'] = undefined;

	const {
		elements: { field, segment, label, hiddenInput },
		states: { segmentContents },
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
