<script lang="ts">
	import { createDialog, melt } from '$lib/index.js';
	import { fade } from 'svelte/transition';

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open },
	} = createDialog({});
	const {
		elements: {
			trigger: triggerA,
			overlay: overlayA,
			content: contentA,
			title: titleA,
			description: descriptionA,
			close: closeA,
			portalled: portalledA,
		},
		states: { open: openA },
	} = createDialog({});
</script>

<main>
	<button use:melt={$trigger} data-testid="trigger">Open</button>
	{#if $open}
		<div use:melt={$portalled} data-testid="portalled">
			<div use:melt={$overlay} data-testid="overlay" transition:fade />
			<div use:melt={$content} data-testid="content">
				<h2 use:melt={$title}>Title</h2>
				<p use:melt={$description}>Description</p>

				<button use:melt={$close} data-testid="closer">Close</button>
				<button use:melt={$triggerA} data-testid="triggerA">Close2</button>
				{#if $openA}
					<div use:melt={$portalledA} data-testid="portalledA">
						<div use:melt={$overlayA} data-testid="overlayA" />
						<div use:melt={$contentA} data-testid="contentA" transition:fade>
							<h2 use:melt={$titleA}>Title</h2>
							<p use:melt={$descriptionA}>Description</p>

							<button use:melt={$closeA} data-testid="closerA">Close</button>
							<button use:melt={$closeA} data-testid="lastA">Close2</button>
						</div>
					</div>
				{/if}
			</div>
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
