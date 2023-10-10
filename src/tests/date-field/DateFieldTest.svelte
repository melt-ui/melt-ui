<script lang="ts">
	import { createDateField, type CreateDateFieldProps } from '$lib/builders';
	import { melt } from '$lib';

	export let value: CreateDateFieldProps['value'] = undefined;
	export let defaultValue: CreateDateFieldProps['defaultValue'] = undefined;
	export let defaultPlaceholderValue: CreateDateFieldProps['defaultPlaceholderValue'] = undefined;
	export let onValueChange: CreateDateFieldProps['onValueChange'] = undefined;
	export let onPlaceholderValueChange: CreateDateFieldProps['onPlaceholderValueChange'] = undefined;
	export let unavailable: CreateDateFieldProps['unavailable'] = undefined;
	export let fieldDisabled: CreateDateFieldProps['fieldDisabled'] = undefined;
	export let fieldReadOnly: CreateDateFieldProps['fieldReadOnly'] = undefined;
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
		unavailable,
		fieldDisabled,
		fieldReadOnly,
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
				use:melt={$dateField}
				class="flex w-full max-w-[300px] items-center rounded-md border bg-white p-1.5 text-magnum-800"
				data-testid="field"
			>
				{#each $segmentContents.arr as seg, i (i)}
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

<style lang="postcss">
	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
