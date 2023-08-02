<script lang="ts">
	import { createDialog, melt } from '$lib';
	/** Internal helpers */
	import { flyAndScale } from '$docs/utils';
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
	} = createDialog();
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
			<h2 use:melt={$title} class="title">Edit profile</h2>
			<p use:melt={$description} class="description">
				Make changes to your profile here. Click save when you're done.
			</p>

			<fieldset>
				<label for="name"> Name </label>
				<input id="name" value="Thomas G. Lopes" />
			</fieldset>
			<fieldset>
				<label for="username"> Username </label>
				<input id="username" value="@thomasglopes" />
			</fieldset>
			<div class="actions">
				<button use:melt={$close} class="secondary"> Cancel </button>
				<button use:melt={$close} class="primary"> Save changes </button>
			</div>

			<button use:melt={$close} aria-label="close" class="close">
				<X class="square-4" />
			</button>
		</div>
	{/if}
</div>

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
		z-index: 4s0;

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
		margin-top: 0.5rem;

		line-height: 1.5;

		--tw-text-opacity: 1;
		color: rgb(82 82 91 / var(--tw-text-opacity));
	}

	fieldset {
		display: flex;
		align-items: center;
		gap: 1.25rem;

		margin-bottom: 1rem;
	}

	fieldset label {
		width: 90px;
		text-align: right;

		--tw-text-opacity: 1;
		color: rgb(150 69 22 / var(--tw-text-opacity));
	}

	fieldset input {
		display: inline-flex;
		flex: 1 1 0%;
		align-items: center;
		justify-content: center;

		height: 2rem;
		width: 100%;

		padding: 0 0.75rem;

		border-radius: 0.125rem;

		border-width: 1px;
		border-style: solid;

		line-height: 1;

		--tw-text-opacity: 1;
		color: rgb(150 69 22 / var(--tw-text-opacity));
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
