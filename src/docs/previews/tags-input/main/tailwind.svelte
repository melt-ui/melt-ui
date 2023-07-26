<script lang="ts">
	import { createTagsInput } from '@melt-ui/svelte';
	import X from '~icons/lucide/x';

	const { root, input, tags, tag, deleteTrigger, edit } = createTagsInput({
		tags: ['Svelte', 'Typescript'],
		unique: true,
	});
</script>

<div class="flex flex-col items-start justify-center gap-2">
	<div
		melt={$root}
		class="flex min-w-[280px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700
		focus-within:ring focus-within:ring-magnum-400"
	>
		{#each $tags as t}
			<div
				melt={$tag(t)}
				class="flex items-center overflow-hidden rounded-md bg-magnum-200 text-magnum-900 [word-break:break-word]
			data-[disabled]:bg-magnum-300 data-[selected]:bg-magnum-400 data-[disabled]:hover:cursor-default
				data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0"
			>
				<span class="flex items-center border-r border-white/10 px-1.5"
					>{t.value}</span
				>
				<button
					melt={$deleteTrigger(t)}
					class="flex h-full items-center px-1 enabled:hover:bg-magnum-300"
				>
					<X class="h-3 w-3" />
				</button>
			</div>
			<div
				melt={$edit(t)}
				class="flex items-center overflow-hidden rounded-md px-1.5 [word-break:break-word] data-[invalid-edit]:focus:!ring-red-500"
			/>
		{/each}

		<input
			melt={$input}
			type="text"
			placeholder="Enter tags..."
			class="min-w-[4.5rem] shrink grow basis-0 border-0 text-black outline-none focus:!ring-0 data-[invalid]:text-red-500"
		/>
	</div>
</div>
