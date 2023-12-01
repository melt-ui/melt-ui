<script lang="ts">
	import { melt } from '$lib';
	import {
		createDateRangeField,
		type CreateDateRangeFieldProps,
	} from '$lib/builders/date-range-field';
	import { removeUndefined } from '../utils';

	export let value: CreateDateRangeFieldProps['value'] = undefined;
	export let defaultValue: CreateDateRangeFieldProps['defaultValue'] = undefined;
	export let defaultPlaceholder: CreateDateRangeFieldProps['defaultPlaceholder'] = undefined;
	export let onValueChange: CreateDateRangeFieldProps['onValueChange'] = undefined;
	export let onPlaceholderChange: CreateDateRangeFieldProps['onPlaceholderChange'] = undefined;
	export let isDateUnavailable: CreateDateRangeFieldProps['isDateUnavailable'] = undefined;
	export let disabled: CreateDateRangeFieldProps['disabled'] = undefined;
	export let readonly: CreateDateRangeFieldProps['readonly'] = undefined;
	export let hourCycle: CreateDateRangeFieldProps['hourCycle'] = undefined;
	export let locale: CreateDateRangeFieldProps['locale'] = 'en';
	export let hideTimeZone: CreateDateRangeFieldProps['hideTimeZone'] = undefined;
	export let ids: CreateDateRangeFieldProps['ids'] = undefined;
	export let startIds: CreateDateRangeFieldProps['startIds'] = undefined;
	export let endIds: CreateDateRangeFieldProps['endIds'] = undefined;
	export let granularity: CreateDateRangeFieldProps['granularity'] = undefined;

	const {
		elements: { field, startSegment, endSegment, label, validation },
		states: { value: insideValue, segmentContents, isInvalid },
	} = createDateRangeField(
		removeUndefined({
			value,
			defaultValue,
			defaultPlaceholder,
			onValueChange,
			onPlaceholderChange,
			isDateUnavailable,
			disabled,
			readonly,
			hourCycle,
			locale,
			hideTimeZone,
			ids,
			startIds,
			endIds,
			granularity,
		})
	);
</script>

<main>
	<div class="flex w-full flex-col items-center gap-3">
		<div class="flex w-full items-center justify-center">
			<p class="text-xs" data-testid="inside-value">{$insideValue.start} - {$insideValue.end}</p>
		</div>
		<div>
			<span use:melt={$label} data-testid="label" class="text-magnum-800">Booking Dates</span>
			<div
				use:melt={$field}
				data-testid="field"
				class="flex w-full max-w-[300px] items-center rounded-md border bg-white p-1.5 text-magnum-800 {$isInvalid &&
					'border-2 border-red-600'}"
			>
				{#each $segmentContents.start as seg, i (i)}
					<div
						use:melt={$startSegment(seg.part)}
						class="segment {$isInvalid && 'text-red-600'}"
						data-testid="start-{seg.part}"
					>
						{seg.value}
					</div>
				{/each}
				<div aria-hidden="true" class="px-2">-</div>
				{#each $segmentContents.end as seg, i (i)}
					<div
						use:melt={$endSegment(seg.part)}
						class="segment {$isInvalid && 'text-red-600'}"
						data-testid="end-{seg.part}"
					>
						{seg.value}
					</div>
				{/each}
			</div>
		</div>
		<span use:melt={$validation} data-testid="validation">Validation</span>
	</div>
</main>
