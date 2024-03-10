<script lang="ts">
	import { createDialog, melt, type CreateDialogProps } from '$lib/index.js';
	import { fade } from 'svelte/transition';
	import { initLevel } from './level.js';

	export let portal: CreateDialogProps['portal'] = undefined;

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
	} = createDialog({ portal });

	const level = initLevel();
</script>

<button use:melt={$trigger} data-testid="dialog-trigger-{level}">Open</button>
<div use:melt={$portalled} data-testid="dialog-portalled-{level}">
	<div use:melt={$overlay} class="overlay" data-testid="dialog-overlay-{level}" transition:fade />
	<div use:melt={$content} class="content" data-testid="dialog-content-{level}">
		<h2 use:melt={$title}>Title</h2>
		<p use:melt={$description}>Description</p>

		<button use:melt={$close} data-testid="dialog-closer-{level}">Close</button>
		<slot />
	</div>
</div>
<div data-testid="dialog-outside-{level}" />

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100vw;
		height: 100vh;
	}

	.content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 1rem;
	}
</style>
