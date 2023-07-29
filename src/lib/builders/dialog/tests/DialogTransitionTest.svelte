<script lang="ts">
	import { createDialog } from '$lib/builders';
	import { fade } from 'svelte/transition';

	const {
		elements: { trigger, overlay, content, title, description, close },
		states: { open },
	} = createDialog({});
</script>

<main>
	<button melt={$trigger} data-testid="trigger">Open</button>
	{#if $open}
		<div melt={$overlay} data-testid="overlay" transition:fade />
		<div melt={$content} data-testid="content">
			<h2 melt={$title}>Title</h2>
			<p melt={$description}>Description</p>

			<button melt={$close} data-testid="closer">Close</button>
			<button melt={$close} data-testid="last">Close2</button>
		</div>
	{/if}
</main>

<style>
	[data-testid='overlay'] {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100vw;
		height: 100vh;
	}

	[data-testid='content'] {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 1rem;
	}
</style>
