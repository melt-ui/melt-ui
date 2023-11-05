<script lang="ts">
	import { createDialog, melt, type CreateDialogProps } from '$lib/index.js';
	import { fade } from 'svelte/transition';

	type $$Props = CreateDialogProps;

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open },
	} = createDialog({
		...$$restProps,
	});
</script>

<main data-testid="main">
	<button use:melt={$trigger} data-testid="trigger">Open</button>
	{#if $open}
		<div use:melt={$portalled} data-testid="portalled">
			<div use:melt={$overlay} data-testid="overlay" transition:fade />
			<div use:melt={$content} data-testid="content" transition:fade>
				<h2 use:melt={$title}>Title</h2>
				<p use:melt={$description}>Description</p>

				<button use:melt={$close} data-testid="closer">Close</button>
				<button use:melt={$close} data-testid="last">Close2</button>
			</div>
		</div>
	{/if}
</main>
<div id="portal-target" data-testid="portal-target" />

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
