<script lang="ts">
	import { createDialog, melt, type CreateDialogProps } from '$lib/index.js';
	import { kbd } from '$lib/internal/helpers/keyboard.js';

	type $$Props = CreateDialogProps;

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open },
	} = createDialog({
		...$$restProps,
	});
</script>

<main data-testid="main">
	<button id="closeFocus" data-testid="closeFocus">Focus Me</button>
	<button use:melt={$trigger} data-testid="trigger">Open</button>
	<div use:melt={$portalled} data-testid="portalled">
		<div use:melt={$overlay} data-testid="overlay" />
		<div use:melt={$content} data-testid="content">
			<h2 use:melt={$title} data-testid="title">Title</h2>
			<p use:melt={$description} data-testid="description">Description</p>
			<input data-testid="input-keydown-interceptor" type="text" on:keydown={(e) => e.key === kbd.ESCAPE && e.stopPropagation()} />

			<button use:melt={$close} data-testid="closer">Close</button>
			<button use:melt={$close} data-testid="last">Close</button>
			<div tabindex="-1" role="button" id="openFocus" data-testid="openFocus">hello world</div>
		</div>
	</div>
</main>
<div id="portal-target" data-testid="portal-target" />

{#if $open}
	<!-- Floating close -->
	<button use:melt={$close} data-testid="floating-closer">Close</button>
{/if}

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

	[data-testid='floating-closer'] {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 999;
	}
</style>
