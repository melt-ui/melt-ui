<script lang="ts">
	import { createDateField, type CreateDateFieldProps } from '$lib/builders';
	import { melt } from '$lib';

	export let value: CreateDateFieldProps['value'] = undefined;
	export let defaultValue: CreateDateFieldProps['defaultValue'] = undefined;
	export let defaultPlaceholder: CreateDateFieldProps['defaultPlaceholder'] = undefined;
	export let onValueChange: CreateDateFieldProps['onValueChange'] = undefined;
	export let onPlaceholderChange: CreateDateFieldProps['onPlaceholderChange'] = undefined;
	export let isDateUnavailable: CreateDateFieldProps['isDateUnavailable'] = undefined;
	export let disabled: CreateDateFieldProps['disabled'] = undefined;
	export let readonly: CreateDateFieldProps['readonly'] = undefined;
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
			<p class="text-xs" data-testid="inside-value">{$insideValue}</p>
		</div>
		<div>
			<span use:melt={$label} class="text-magnum-800" data-testid="label">Date</span>
			<div
				use:melt={$field}
				class="flex w-full max-w-[300px] items-center rounded-md border bg-white p-1.5 text-magnum-800"
				data-testid="field"
			>
				{#each $segmentContents as seg, i (i)}
					<div
						use:melt={$segment(seg.part)}
						class="segment whitespace-nowrap"
						data-testid={seg.part === 'literal' ? undefined : seg.part}
					>
						{seg.value}
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>
