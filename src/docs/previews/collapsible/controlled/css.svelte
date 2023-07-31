<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte/builders/collapsible';
	import { slide } from 'svelte/transition';
	import { ChevronsUpDown, X } from 'lucide-svelte';
	import { writable } from 'svelte/store';

	const customOpen = writable(true);

	const {
		elements: { root, content, trigger },
		states: { open },
	} = createCollapsible({
		open: customOpen,
	});
</script>

<div melt={$root} class="root">
	<div class="header">
		<span class="label"> @thomasglopes starred 3 repositories </span>
		<button melt={$trigger}>
			<div class="abs-center">
				{#if $open}
					<X />
				{:else}
					<ChevronsUpDown />
				{/if}
			</div>
		</button>
	</div>

	<div class="item">
		<span>melt-ui/melt-ui</span>
	</div>

	{#if $open}
		<div melt={$content} transition:slide>
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

		--tw-text-opacity: 1;
		color: rgb(255 255 255 / var(--tw-text-opacity));
	}

	button {
		position: relative;
		height: 1.5rem;
		width: 1.5rem;
		place-items: center;
		border-radius: 9999px;

		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));

		--tw-text-opacity: 1;
		color: rgb(189 87 17 / var(--tw-text-opacity));
		font-size: 0.875rem;
		line-height: 1.25rem;

		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
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

		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));

		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
	}

	.item span {
		font-size: 1rem;
		line-height: 25px;

		--tw-text-opacity: 1;
		color: rgb(150 69 22 / var(--tw-text-opacity));
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
