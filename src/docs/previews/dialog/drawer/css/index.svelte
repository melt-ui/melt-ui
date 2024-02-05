<script lang="ts">
	import { createDialog, melt } from '$lib/index.js';
	import { fade, fly } from 'svelte/transition';
	// Internal helpers
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
</script>

<button use:melt={$trigger} class="trigger"> View Notifications </button>
<div use:melt={$portalled}>
	{#if $open}
		<div
			use:melt={$overlay}
			class="overlay"
			transition:fade={{ duration: 150 }}
		/>
		<div
			use:melt={$content}
			class="content"
			transition:fly={{
				x: -350,
				duration: 300,
				opacity: 1,
			}}
		>
			<button use:melt={$close} aria-label="Close" class="close">
				<X class="square-4" />
			</button>
			<h2 use:melt={$title} class="title">Notifications</h2>
			<p use:melt={$description} class="description">
				Check out your latest updates.
			</p>
			<section>
				<div class="invitation">
					<h3>New invitation</h3>
					<p>
						You have been invited to join the <strong>Designers</strong> team.
					</p>
					<div class="actions">
						<button class="secondary"> Reject </button>
						<button class="primary"> Accept </button>
					</div>
				</div>
			</section>
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
		left: 0;
		top: 0;

		z-index: 50;

		height: 100vh;
		max-width: 500px;

		width: 100%;

		padding: 1.5rem;

		background-color: rgb(var(--color-white) / 1);

		box-shadow: 0 10px 15px -3px rgb(var(--color-black) / 0.1),
			0 4px 6px -4px rgb(var(--color-black) / 0.1);
	}

	.content:focus {
		outline: 2px solid transparent;
		outline-offset: 2px;
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

	.invitation {
		border-radius: 0.375rem;
		background-color: rgb(var(--color-grey-100) / 0.8);

		color: rgb(var(--color-zinc-800) / 1);

		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
	}

	.invitation h3 {
		margin-bottom: 0.75rem;

		font-size: 1rem;
		line-height: 1.5rem;
		font-weight: 600;
	}

	.invitation p {
		font-size: 0.875rem;
		line-height: 1.25rem;
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
