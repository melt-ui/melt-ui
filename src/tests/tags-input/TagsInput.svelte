<script lang="ts">
	import { createTagsInput, melt, type AddTag } from '$lib/index.js';

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
	<div use:melt={$root}>
		{#each $tags as t, i}
			<div data-testid="tag-{i}" use:melt={$tag(t)}>
				<span>{t.value}</span>
				<button data-testid="delete-tag-{i}" use:melt={$deleteTrigger(t)}> Delete </button>
			</div>
			<div data-testid="edit-tag-{i}" use:melt={$edit(t)} />
		{/each}

		<input use:melt={$input} type="text" placeholder="Enter tags..." />
	</div>
</main>
