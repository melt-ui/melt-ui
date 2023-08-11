<script lang="ts">
	import { createTagsInput, melt, type AddTag } from '$lib/index.js';
	import { X } from 'lucide-svelte';

	export let defaultTags = ['Svelte', 'Typescript'];
	export let unique = true;
	export let trim = true;
	export let allowed: string[] | undefined = undefined;
	export let add: AddTag | undefined = undefined;
	const {
		elements: { root, input, tag, deleteTrigger, edit },
		states: { tags },
	} = createTagsInput({
		defaultTags,
		unique,
		allowed,
		add,
		trim,
	});
</script>

<main>
	<div class="flex flex-col items-start justify-center gap-2">
		<div
			use:melt={$root}
			class="flex min-w-[280px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700
		focus-within:ring focus-within:ring-magnum-400"
		>
			{#each $tags as t, i}
				<div
					data-testid="tag-{i}"
					use:melt={$tag(t)}
					class="flex items-center overflow-hidden rounded-md bg-magnum-200 text-magnum-900 [word-break:break-word]
		data-[disabled]:bg-magnum-300 data-[selected]:bg-magnum-400 data-[disabled]:hover:cursor-default
		data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0"
				>
					<span class="flex items-center border-r border-white/10 px-1.5">{t.value}</span>
					<button
						data-testid="delete-tag-{i}"
						use:melt={$deleteTrigger(t)}
						class="flex h-full items-center px-1 enabled:hover:bg-magnum-300"
					>
						<X class="square-3" />
					</button>
				</div>
				<div
					data-testid="edit-tag-{i}"
					use:melt={$edit(t)}
					class="flex items-center overflow-hidden rounded-md px-1.5 [word-break:break-word] data-[invalid-edit]:focus:!ring-red-500"
				/>
			{/each}

			<input
				use:melt={$input}
				type="text"
				placeholder="Enter tags..."
				class="min-w-[4.5rem] shrink grow basis-0 border-0 text-black outline-none focus:!ring-0 data-[invalid]:text-red-500"
			/>
		</div>
	</div>
</main>
