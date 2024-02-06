<script lang="ts">
	import { createDialog, melt } from '$lib/index.js';
	/** Internal helpers */
	import { flyAndScale } from '$docs/utils/index.js';
	import { X } from '$icons/index.js';

	const {
		elements: {
			trigger,
			overlay,
			content,
			title,
			description,
			close,
			portalled,
		},
		states: { open },
	} = createDialog({
		forceVisible: true,
	});

	const {
		elements: {
			trigger: triggerNested,
			overlay: overlayNested,
			content: contentNested,
			title: titleNested,
			description: descriptionNested,
			close: closeNested,
			portalled: portalledNested,
		},
		states: { open: openNested },
	} = createDialog({
		forceVisible: true,
	});
</script>

<button use:melt={$trigger} class="trigger"> Open Dialog </button>
<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="overlay" />
		<div
			class="content"
			transition:flyAndScale={{
				duration: 150,
				y: 8,
				start: 0.96,
			}}
			use:melt={$content}
		>
			<h2 use:melt={$title} class="title">First dialog</h2>
			<p use:melt={$description} class="description">
				This is the first dialog. It contains a trigger to open a second dialog.
			</p>

			<div class="actions">
				<button use:melt={$close} class="secondary"> Cancel </button>
				<button use:melt={$triggerNested} class="primary"> Open second </button>
			</div>

			<button use:melt={$close} class="close">
				<X />
			</button>
		</div>
	{/if}
</div>

<div use:melt={$portalledNested}>
	{#if $openNested}
		<div use:melt={$overlayNested} class="overlay overlay-nested" />
		<div
			class="content content-nested"
			transition:flyAndScale={{
				duration: 150,
				y: 8,
				start: 0.96,
			}}
			use:melt={$contentNested}
		>
			<h2 use:melt={$titleNested} class="title">Second dialog</h2>
			<p use:melt={$descriptionNested} class="description">
				This is the second dialog.
			</p>

			<div class="actions">
				<button use:melt={$closeNested} class="secondary"> Close </button>
			</div>

			<button use:melt={$closeNested} class="close">
				<X />
			</button>
		</div>
	{/if}
</div>

<style>
	.trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		padding: 0.5rem 1rem;

		border-radius: 0.375rem;

		background-color: rgb(var(--color-white) / 1);

		font-weight: 500;
		line-height: 1;

		color: rgb(var(--color-magnum-700) / 1);

		box-shadow: 0 10px 15px -3px rgb(var(--color-black) / 0.1),
			0 4px 6px -4px rgb(var(--color-black) / 0.1);
	}

	.trigger:hover {
		opacity: 0.75;
	}

	.overlay {
		position: fixed;
		inset: 0;
		z-index: 40;

		background-color: rgb(var(--color-black) / 0.5);
	}

	.overlay-nested {
		background-color: rgb(var(--color-black) / 0.75);
	}

	.content {
		position: fixed;
		left: 50%;
		top: 50%;

		z-index: 50;

		max-height: 85vh;
		width: 90vw;
		max-width: 450px;

		transform: translate(-50%, -50%);

		border-radius: 0.375rem;

		background-color: rgb(var(--color-white) / 1);

		padding: 1.5rem;

		box-shadow: 0 10px 15px -3px rgb(var(--color-black) / 0.1),
			0 4px 6px -4px rgb(var(--color-black) / 0.1);
	}

	.content:focus {
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	.content-nested {
		box-shadow: 0 25px 50px -12px rgb(var(--color-black) / 0.25);
	}

	.close {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		position: absolute;
		right: 10px;
		top: 10px;

		appearance: none;

		height: 1.5rem;
		width: 1.5rem;

		border-radius: 9999px;

		color: rgb(var(--color-magnum-800) / 1);
	}

	.close:hover {
		background-color: rgb(var(--color-magnum-100) / 1);
	}

	.close:focus {
		outline: 2px solid transparent;
		outline-offset: 2px;

		box-shadow: 0px 0px 0px 3px rgb(var(--color-magnum-400) / 1);
	}

	.title {
		margin: 0;

		font-size: 1.125rem;
		line-height: 1.75rem;
		font-weight: 500;

		color: rgb(var(--color-black) / 1);
	}

	.description {
		margin-bottom: 1.25rem;
		margin-top: 0.5rem;

		line-height: 1.5;

		color: rgb(var(--color-zinc-600) / 1);
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;

		margin-top: 1.5rem;
	}

	.actions button {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		height: 2rem;

		border-radius: 0.25rem;

		padding: 0 1rem;

		font-weight: 500;
		line-height: 1;
	}

	.actions button.secondary {
		background-color: rgb(var(--color-zinc-100) / 1);

		color: rgb(var(--color-zinc-600) / 1);
	}

	.actions button.primary {
		background-color: rgb(var(--color-magnum-100) / 1);

		color: rgb(var(--color-magnum-900) / 1);
	}
</style>
