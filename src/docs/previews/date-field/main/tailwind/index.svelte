<script lang="ts">
	import { createDateField, melt } from '$lib';
	import LocaleCombobox from './LocaleCombobox.svelte';

	const {
		elements: { field, segment, label },
		states: { segmentContents },
		options: { locale },
	} = createDateField();
</script>

<section>
	<LocaleCombobox
		onSelectedChange={({ next }) => {
			if (next) {
				locale.set(next.value);
			}
			return next;
		}}
	/>
	<div class="flex h-full w-full flex-col">
		<span use:melt={$label}>Date</span>
		<div use:melt={$field}>
			{#key $locale}
				{#each $segmentContents as seg}
					<div use:melt={$segment(seg.part)}>
						{seg.value}
					</div>
				{/each}
			{/key}
		</div>
	</div>
</section>

<style lang="postcss">
	section {
		@apply flex w-full flex-col items-center gap-3;
	}

	[data-melt-datefield-label] {
		@apply font-medium text-magnum-800 select-none;
	}

	[data-melt-datefield-label][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-field] {
		@apply mt-0.5 flex w-full min-w-[160px] items-center rounded-lg border border-magnum-400/60 bg-white p-1.5 text-magnum-800 shadow-md;
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
