<script lang="ts">
	import { createDateField, type CreateDateFieldProps } from '$lib/builders/index.js';
	import { melt } from '$lib/index.js';
	import { PreviewWrapper } from '$docs/components/index.js';

	export let value: CreateDateFieldProps['value'] = undefined;
	export let defaultValue: CreateDateFieldProps['defaultValue'] = undefined;
	export let defaultPlaceholder: CreateDateFieldProps['defaultPlaceholder'] = undefined;
	export let onValueChange: CreateDateFieldProps['onValueChange'] = undefined;
	export let onPlaceholderChange: CreateDateFieldProps['onPlaceholderChange'] = undefined;
	export let isDateUnavailable: CreateDateFieldProps['isDateUnavailable'] = undefined;
	export let disabled: CreateDateFieldProps['disabled'] = undefined;
	export let readonly: CreateDateFieldProps['readonly'] = undefined;
	export let readonlySegments: CreateDateFieldProps['readonlySegments'] = undefined;
	export let hourCycle: CreateDateFieldProps['hourCycle'] = undefined;
	export let locale: CreateDateFieldProps['locale'] = 'en';
	export let hideTimeZone: CreateDateFieldProps['hideTimeZone'] = undefined;
	export let ids: CreateDateFieldProps['ids'] = undefined;
	export let granularity: CreateDateFieldProps['granularity'] = undefined;

	const {
		elements: { field, segment, label },
		states: { value: insideValue, segmentContents },
	} = createDateField({
		value,
		defaultValue,
		defaultPlaceholder,
		onValueChange,
		onPlaceholderChange,
		isDateUnavailable,
		disabled,
		readonly,
		readonlySegments,
		hourCycle,
		locale,
		hideTimeZone,
		ids,
		granularity,
	});
</script>

<PreviewWrapper>
	<div class="flex w-full flex-col items-center gap-3">
		<div>
			<span use:melt={$label} class="font-medium text-magnum-900">Due Date</span>
			<div
				use:melt={$field}
				class="mt-0.5 flex w-full min-w-[200px] items-center rounded-lg border bg-white p-1.5 text-magnum-900"
			>
				{#each $segmentContents as seg, i (i)}
					<div use:melt={$segment(seg.part)} class="segment whitespace-nowrap">
						{seg.value}
					</div>
				{/each}
			</div>
		</div>
		<div class="flex w-full">
			<p class="text-sm font-medium text-magnum-900">
				<span> Selected Date: </span>
				{#if $insideValue}
					{$insideValue}
				{/if}
			</p>
		</div>
	</div>
</PreviewWrapper>

<style lang="postcss">
	.segment:not([data-segment='literal']) {
		@apply px-0.5;
	}
	.segment {
		@apply data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
