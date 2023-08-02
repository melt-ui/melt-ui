<script lang="ts">
	import { createCollapsible, melt } from '$lib';
	import { slide } from 'svelte/transition';
	import { ChevronsUpDown, X } from 'lucide-svelte';

	const {
		elements: { root, content, trigger },
		states: { open },
	} = createCollapsible();
</script>

<div use:melt={$root} class="root">
	<div class="header">
		<span class="label"> @thomasglopes starred 3 repositories </span>
		<button use:melt={$trigger}>
			<div class="abs-center">
				{#if $open}
					<X class="square-4" />
				{:else}
					<ChevronsUpDown class="square-4" />
				{/if}
			</div>
		</button>
	</div>

	<div class="item">
		<span>melt-ui/melt-ui</span>
	</div>

	{#if $open}
		<div use:melt={$content} transition:slide>
			<div class="collapsible">
				<div class="item">
					<span>sveltejs/svelte</span>
				</div>
				<div class="item">
					<span>sveltejs/kit</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.root {
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		max-width: 28rem;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.label {
		font-size: 0.875rem;
		line-height: 1.5rem;

		color: rgb(var(--color-white) / 1);
	}

	button {
		position: relative;
		height: 1.5rem;
		width: 1.5rem;
		place-items: center;
		border-radius: 9999px;

		background-color: rgb(var(--color-white) / 1);

		color: rgb(var(--color-magnum-700) / 1);
		font-size: 0.875rem;
		line-height: 1.25rem;

		box-shadow: 0 10px 15px -3px rgb(var(--color-black) / 0.1),
			0 4px 6px -4px rgb(var(--color-black) / 0.1);
	}

	button:hover {
		opacity: 0.75;
	}

	button[data-disabled] {
		cursor: not-allowed;
		opacity: 0.75;
	}

	.item {
		padding: 0.75rem;
		border-radius: 0.25rem;

		background-color: rgb(var(--color-white) / 1);

		box-shadow: 0 10px 15px -3px rgb(var(--color-black) / 0.1),
			0 4px 6px -4px rgb(var(--color-black) / 0.1);
	}

	.item span {
		font-size: 1rem;
		line-height: 25px;

		color: rgb(var(--color-magnum-800) / 1);
	}

	.item::first-of-type {
		margin: 0.5rem 0;
	}

	.collapsible {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.abs-center {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
