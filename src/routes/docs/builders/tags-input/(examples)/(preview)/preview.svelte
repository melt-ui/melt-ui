<script lang="ts">
	import { createTagsInput } from '$lib';
	import X from '~icons/lucide/x';

	const { root, input, tags, tag, deleteTrigger } = createTagsInput({
		tags: ['one', 'two'],
	});
</script>

<div class="flex flex-col items-start justify-center gap-2 overflow-hidden">
	<div
		{...$root}
		use:root.action
		class="flex w-[340px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700"
	>
		{#each $tags as t, i}
			<div {...$tag(t)} class="tag">
				<span class="flex items-center border-r border-white/10 px-1.5">{t.value}</span>

				<button {...$deleteTrigger(t)} use:deleteTrigger.action class="tag-delete">
					<X class="h-3 w-3" />
				</button>
			</div>
		{/each}

		<input
			{...$input}
			use:input.action
			type="text"
			class="shake min-w-[4.5rem] shrink grow basis-0 border-0 outline-none focus:!ring-0"
		/>
	</div>
</div>

<style lang="postcss">
	.tag {
		@apply flex items-center overflow-hidden rounded-md [word-break:break-word];
		@apply bg-magnum-600 text-white;
		@apply data-[selected]:bg-teal-500;
		@apply data-[disabled]:bg-magnum-300 data-[disabled]:hover:cursor-default data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0;
	}

	.tag-delete {
		@apply flex h-full items-center px-1;
		@apply enabled:hover:bg-magnum-700;
		@apply data-[selected]:hover:bg-teal-600;
	}
</style>
