<script lang="ts">
	import { createDateField, type CreateDateFieldProps } from '$lib/builders';
	import { melt } from '$lib';
	import {
		createDateRangeField,
		type CreateDateRangeFieldProps,
	} from '$lib/builders/date-range-field';

	export let value: CreateDateRangeFieldProps['value'] = undefined;
	export let defaultValue: CreateDateRangeFieldProps['defaultValue'] = undefined;
	export let defaultPlaceholderValue: CreateDateRangeFieldProps['defaultPlaceholderValue'] =
		undefined;
	export let onValueChange: CreateDateRangeFieldProps['onValueChange'] = undefined;
	export let onPlaceholderValueChange: CreateDateRangeFieldProps['onPlaceholderValueChange'] =
		undefined;
	export let isUnavailable: CreateDateRangeFieldProps['isUnavailable'] = undefined;
	export let fieldDisabled: CreateDateRangeFieldProps['fieldDisabled'] = undefined;
	export let fieldReadonly: CreateDateRangeFieldProps['fieldReadonly'] = undefined;
	export let hourCycle: CreateDateRangeFieldProps['hourCycle'] = undefined;
	export let locale: CreateDateRangeFieldProps['locale'] = 'en';
	export let hideTimeZone: CreateDateRangeFieldProps['hideTimeZone'] = undefined;
	export let ids: CreateDateRangeFieldProps['ids'] = undefined;
	export let granularity: CreateDateRangeFieldProps['granularity'] = undefined;

	const {
		elements: { dateField, startSegment, endSegment, label },
		states: { value: insideValue, segmentContents, isFieldInvalid },
	} = createDateRangeField({
		value,
		defaultValue,
		defaultPlaceholderValue,
		onValueChange,
		onPlaceholderValueChange,
		isUnavailable,
		fieldDisabled,
		fieldReadonly,
		hourCycle,
		locale,
		hideTimeZone,
		ids,
		granularity,
	});
</script>

<main>
	<div class="flex w-full flex-col items-center gap-3">
		<div class="flex w-full items-center justify-center">
			<p class="text-xs" data-testid="inside-value">{$insideValue.start} - {$insideValue.end}</p>
		</div>
		<div>
			<span use:melt={$label} data-testid="label" class="text-magnum-800">Booking Dates</span>
			<div
				use:melt={$dateField}
				data-testid="field"
				class="flex w-full max-w-[300px] items-center rounded-md border bg-white p-1.5 text-magnum-800 {$isFieldInvalid &&
					'border-2 border-red-600'}"
			>
				{#each $segmentContents.start.arr as seg, i (i)}
					<div
						use:melt={$startSegment(seg.part)}
						class="segment {$isFieldInvalid && 'text-red-600'}"
						data-testid="start-{seg.part}"
					>
						{seg.value}
					</div>
				{/each}
				<div aria-hidden="true" class="px-2">-</div>
				{#each $segmentContents.end.arr as seg, i (i)}
					<div
						use:melt={$endSegment(seg.part)}
						class="segment {$isFieldInvalid && 'text-red-600'}"
						data-testid="end-{seg.part}"
					>
						{seg.value}
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>