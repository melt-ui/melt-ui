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
			<button on:click={() => open.update((p) => !p)} data-testid="toggle-open">toggle open</button>
			<input
				data-testid="input-keydown-interceptor"
				type="text"
				on:keydown={(e) => e.key === kbd.ESCAPE && e.stopPropagation()}
			/>

			<button use:melt={$close} data-testid="closer">Close</button>
			<button use:melt={$close} data-testid="last">Close</button>
			<div tabindex="-1" role="button" id="openFocus" data-testid="openFocus">hello world</div>
		</div>
	</div>
</main>
<div id="portal-target" data-testid="portal-target" />

<button on:click|stopPropagation data-testid="click-interceptor">click interceptor</button>
<button on:pointerdown|stopPropagation data-testid="pointerdown-interceptor">
	pointerdown interceptor
</button>
<button on:pointerup|stopPropagation data-testid="pointerup-interceptor">
	pointerup interceptor
</button>
<button on:mousedown|stopPropagation data-testid="mousedown-interceptor">
	mousedown interceptor
</button>
<button on:mouseup|stopPropagation data-testid="mouseup-interceptor">mouseup interceptor</button>
<button on:touchstart|stopPropagation data-testid="touchstart-interceptor">
	touchstart interceptor
</button>
<button on:touchend|stopPropagation data-testid="touchend-interceptor">
	touchend interceptor
</button>
<button
	on:touchend|preventDefault|stopPropagation
	data-testid="touchend-prevent-default-interceptor"
>
	touchend prevent default interceptor
</button>

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
