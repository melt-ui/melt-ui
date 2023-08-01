<script lang="ts">
	import { createDialog, melt } from '$lib';
	/** Internal helpers */
	import { flyAndScale } from '$docs/utils';
	import { X } from 'lucide-svelte';

	const {
		elements: { trigger, overlay, content, title, description, close },
		states: { open },
	} = createDialog({
		role: 'alertdialog',
	});
</script>

<button use:melt={$trigger} class="trigger"> Delete Item </button>
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
			<X />
		</button>
	</div>
{/if}

<style lang="postcss">
	.trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		padding: 0.5rem 1rem;

		border-radius: 0.375rem;

		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));

		font-weight: 500;
		line-height: 1;

		--tw-text-opacity: 1;
		color: rgb(189 87 17 / var(--tw-text-opacity));

		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
	}

	.trigger:hover {
		opacity: 0.75;
	}

	.overlay {
		position: fixed;
		inset: 0;
		z-index: 50;

		background-color: rgb(0 0 0 / 0.5);
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

		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));

		padding: 1.5rem;

		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
	}

	.title {
		margin: 0;

		font-size: 1.125rem;
		line-height: 1.75rem;
		font-weight: 500;

		--tw-text-opacity: 1;
		color: rgb(0 0 0 / var(--tw-text-opacity));
	}

	.description {
		margin-bottom: 1.25rem;
		magin-top: 0.5rem;

		line-height: 1.5;

		--tw-text-opacity: 1;
		color: rgb(82 82 91 / var(--tw-text-opacity));
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
		--tw-bg-opacity: 1;
		background-color: rgb(244 244 245 / var(--tw-bg-opacity));

		--tw-text-opacity: 1;
		color: rgb(82 82 91 / var(--tw-text-opacity));
	}

	.actions button.primary {
		--tw-bg-opacity: 1;
		background-color: rgb(254 242 214 / var(--tw-bg-opacity));

		--tw-text-opacity: 1;
		color: rgb(121 58 21 / var(--tw-text-opacity));
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

		--tw-text-opacity: 1;
		color: rgb(150 69 22 / var(--tw-text-opacity));
	}

	.close:hover {
		--tw-bg-opacity: 1;
		background-color: rgb(254 242 214 / var(--tw-bg-opacity));
	}

	.close:focus {
		--tw-shadow-color: #f7b155;
		--tw-shadow: var(--tw-shadow-colored);
	}
</style>
