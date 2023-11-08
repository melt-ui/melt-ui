<script lang="ts">
	import { createDialog, melt } from '$lib/index.js';
	/** Internal helpers */
	import { flyAndScale } from '$docs/utils/index.js';
	import { X } from 'lucide-svelte';

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
		role: 'alertdialog',
		forceVisible: true,
	});
</script>

<button use:melt={$trigger} class="trigger"> Delete Item </button>
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
			<h2 use:melt={$title} class="title">
				Are you sure you want to delete this?
			</h2>
			<p use:melt={$description} class="description">
				This action cannot be undone. This will permanently delete the item and
				remove it from our servers.
			</p>

			<div class="actions">
				<button use:melt={$close} class="secondary"> Cancel </button>
				<button use:melt={$close} class="primary"> Continue </button>
			</div>

			<button use:melt={$close} aria-label="Close" class="close">
				<X class="square-4" />
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
		z-index: 50;

		background-color: rgb(var(--color-black) / 0.5);
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

		color: rgb(var(--color-neutral-600) / 1);
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
		box-shadow: 0px 0px 0px 3px rgb(var(--color-magnum-400) / 1);
	}
</style>
