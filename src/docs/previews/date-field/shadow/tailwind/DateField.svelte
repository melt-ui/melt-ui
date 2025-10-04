<script lang="ts">
	import { createDateField, melt } from '$lib/index.js';

	export let componentRoot;

	const {
		elements: { field, segment, label, hiddenInput },
		states: { value, segmentContents },
	} = createDateField({
		rootElement: componentRoot,
	});
</script>

<div>
	<form method="POST">
		<div>
			<span use:melt={$label}>Appointment Date</span>
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
</div>
