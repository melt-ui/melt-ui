<script lang="ts">
	import { createDialog, melt } from '$lib';
	import { fade, fly } from 'svelte/transition';
	// Internal helpers
	import { X } from 'lucide-svelte';

	const {
		elements: { trigger, overlay, content, title, description, close },
		states: { open },
	} = createDialog();
</script>

<button use:melt={$trigger} class="trigger"> View Notifications </button>
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
			<X />
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
		left: 0;
		top: 0;

		z-index: 50;

		height: 100vh;
		max-width: 350px;

		width: 100%;

		padding: 1.5rem;

		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));

		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
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

		--tw-text-opacity: 1;
		color: rgb(150 69 22 / var(--tw-text-opacity));
	}

	.close:hover {
		--tw-bg-opacity: 1;
		background-color: rgb(254 242 214 / var(--tw-bg-opacity));
	}

	.close:focus {
		outline: 2px solid transparent;
		outline-offset: 2px;

		--tw-shadow-color: #f7b155;
		--tw-shadow: var(--tw-shadow-colored);

		--tw-ring-opacity: 1;
		--tw-ring-color: rgb(247 177 85 / var(--tw-ring-opacity));
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
			var(--tw-ring-offset-width) var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0
			calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
			var(--tw-shadow, 0 0 #0000);
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

	.invitation {
		border-radius: 0.375rem;
		background-color: rgb(243 244 246 / 0.8);

		--tw-text-opacity: 1;
		color: rgb(39 39 42 / var(--tw-text-opacity));

		--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
			0 1px 2px -1px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
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
</style>
