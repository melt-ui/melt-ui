<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';

	const {
		elements: { trigger, overlay, content, title, description, close },
	} = createDialog();
</script>

<main>
	<button melt={$trigger} data-testid="trigger">Open</button>
	<div melt={$overlay} data-testid="overlay" />
	<div melt={$content} data-testid="content">
		<h2 melt={$title}>Title</h2>
		<p melt={$description}>Description</p>

		<button melt={$close} data-testid="closer">Close</button>
		<button melt={$close} data-testid="last">Close</button>
	</div>
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
