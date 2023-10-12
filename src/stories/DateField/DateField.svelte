<script lang="ts">
	import { createDateField, type CreateDateFieldProps } from '$lib/builders';
	import { melt } from '$lib';
	import { PreviewWrapper } from '$docs/components';

	export let value: CreateDateFieldProps['value'] = undefined;
	export let defaultValue: CreateDateFieldProps['defaultValue'] = undefined;
	export let defaultPlaceholderValue: CreateDateFieldProps['defaultPlaceholderValue'] = undefined;
	export let onValueChange: CreateDateFieldProps['onValueChange'] = undefined;
	export let onPlaceholderValueChange: CreateDateFieldProps['onPlaceholderValueChange'] = undefined;
	export let isUnavailable: CreateDateFieldProps['isUnavailable'] = undefined;
	export let fieldDisabled: CreateDateFieldProps['fieldDisabled'] = undefined;
	export let fieldReadonly: CreateDateFieldProps['fieldReadonly'] = undefined;
	export let hourCycle: CreateDateFieldProps['hourCycle'] = undefined;
	export let locale: CreateDateFieldProps['locale'] = 'en';
	export let hideTimeZone: CreateDateFieldProps['hideTimeZone'] = undefined;
	export let ids: CreateDateFieldProps['ids'] = undefined;
	export let granularity: CreateDateFieldProps['granularity'] = undefined;

	const {
		elements: { dateField, segment, label },
		states: { value: insideValue, segmentContents },
	} = createDateField({
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

<PreviewWrapper>
	<div class="flex w-full flex-col items-center gap-3">
		<div>
			<span use:melt={$label} class="font-medium text-magnum-900">Due Date</span>
			<div
				use:melt={$dateField}
				class="mt-0.5 flex w-full min-w-[200px] items-center rounded-lg border bg-white p-1.5 text-magnum-900"
			>
				{#each $segmentContents.arr as seg, i (i)}
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
