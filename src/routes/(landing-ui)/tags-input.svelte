<script lang="ts">
	import { createTagsInput, melt } from '$lib/index.js';
	import { X } from 'lucide-svelte';

	const {
		elements: { root, input, tag, deleteTrigger, edit },
		states: { tags },
	} = createTagsInput({
		defaultTags: ['Svelte', 'Typescript'],
		unique: true,
		add(tag) {
			return { id: tag, value: tag };
		},
	});

	let className = '';
	export { className as class };
</script>

<div class="container {className}">
	<div use:melt={$root} class="root">
		{#each $tags as t}
			<div use:melt={$tag(t)} class="tag">
				<span class="tag-value">{t.value}</span>
				<button class="tag-close" use:melt={$deleteTrigger(t)}>
					<X class="square-3" />
				</button>
			</div>
			<div use:melt={$edit(t)} class="tag-edit" />
		{/each}

		<input use:melt={$input} type="text" placeholder="Enter tags..." class="input" />
	</div>
</div>

<style>
	* {
		all: unset;
		box-sizing: border-box;
	}

	:root {
		--magnum-300: #f9c978;
		--magnum-200: #fce0ac;
		--magnum-400: #f7b155;
		--magnum-700: #bd5711;
		--magnum-900: #793a15;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;

		gap: 0.625rem;
	}

	.root {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.625rem;
		border-radius: 0.75rem;
		background-color: white;
		padding: 0.5rem;
		color: var(--magnum-700);
		min-width: 280px;
	}

	.root:focus-within {
		box-shadow: 0 0 0 3px var(-magnum-400);
	}

	.input {
		min-width: 1.125rem;

		flex-shrink: 1;
		flex-grow: 1;
		flex-basis: 0;
		border: none;
		color: black;
		outline: none;
	}

	.input:focus {
		box-shadow: none !important;
	}

	:global([data-invalid]).input:focus {
		color: rgb(239 68 68);
	}

	.tag {
		display: flex;
		align-items: center;
		overflow: hidden;
		border-radius: 0.5rem;
		background-color: var(--magnum-200);
		color: var(--magnum-900);
		word-break: break-word;
	}

	:global([data-disabled]).tag {
		background-color: var(--magnum-300);
	}

	:global([data-disabled]).tag:hover {
		cursor: default;
	}

	:global([data-disabled]).tag:focus {
		outline: none !important;
		box-shadow: none !important;
	}

	:global([data-selected]).tag {
		background-color: var(--magnum-400);
	}

	.tag-value {
		display: flex;
		align-items: center;
		padding: 0 0.375rem;
	}

	.tag-close {
		display: flex;
		align-items: center;

		cursor: pointer;
		height: 100%;
		padding: 0 0.25rem;
	}

	.tag-close:hover {
		background-color: var(--magnum-300);
	}

	.tag-edit {
		display: flex;
		align-items: center;
		overflow: hidden;
		border-radius: 0.375rem;
		padding: 0 0.375rem;
		word-break: break-word;
	}
</style>
