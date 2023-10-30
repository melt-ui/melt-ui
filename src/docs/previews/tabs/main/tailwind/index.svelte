<script lang="ts">
	import { createTabs, melt } from '$lib/index.js';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	const {
		elements: { root, list, content, trigger },
		states: { value },
	} = createTabs({
		defaultValue: 'tab-1',
	});

	const triggers = [
		{ id: 'tab-1', title: 'Account' },
		{ id: 'tab-2', title: 'Password' },
		{ id: 'tab-3', title: 'Settings' },
	];

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut,
	});
</script>

<div use:melt={$root} class="root">
	<div use:melt={$list} class="list" aria-label="Manage your account">
		{#each triggers as triggerItem}
			<button use:melt={$trigger(triggerItem.id)} class="trigger">
				{triggerItem.title}
				{#if $value === triggerItem.id}
					<div
						in:send={{ key: 'trigger' }}
						out:receive={{ key: 'trigger' }}
						class="trigger-indicator"
					/>
				{/if}
			</button>
		{/each}
	</div>
	<div use:melt={$content('tab-1')} class="content">
		<p>Make changes to your account here. Click save when you're done.</p>
		<fieldset>
			<label for="name"> Name </label>
			<input id="name" value="Thomas G. Lopes" />
		</fieldset>

		<div class="mt-5 flex justify-end">
			<button class="save">Save changes</button>
		</div>
	</div>
	<div use:melt={$content('tab-2')} class="content">
		<p>Change your password here. Click save when you're done.</p>
		<fieldset>
			<label for="new"> New password </label>
			<input id="new" type="password" />
		</fieldset>
		<div class="mt-5 flex justify-end">
			<button class="save">Save changes</button>
		</div>
	</div>
	<div use:melt={$content('tab-3')} class="content">
		<p>Change your settings here. Click save when you're done.</p>

		<fieldset>
			<label for="new"> New email </label>
			<input id="new" type="password" />
		</fieldset>
		<div class="mt-5 flex justify-end">
			<button class="save">Save changes</button>
		</div>
	</div>
</div>

<style>
	/* Reset */
	* {
		all: unset;
	}

	:global([hidden])* {
		display: none;
	}

	/* CSS Vars */
	:root {
		--magnum-50: #fff9ed;
		--magnum-100: #fef2d6;
		--magnum-200: #fce0ac;
		--magnum-300: #f9c978;
		--magnum-400: #f7b155;
		--magnum-500: #f38d1c;
		--magnum-600: #e47312;
		--magnum-700: #bd5711;
		--magnum-800: #964516;
		--magnum-900: #793a15;
		--magnum-950: #411c09;

		--neutral-50: #fafafa;
		--neutral-100: #f5f5f5;
		--neutral-200: #e5e5e5;
		--neutral-300: #d4d4d4;
		--neutral-400: #a3a3a3;
		--neutral-500: #737373;
		--neutral-600: #525252;
		--neutral-700: #404040;
		--neutral-800: #262626;
		--neutral-900: #171717;
		--neutral-950: #0a0a0a;

		--radius-sm: 0.125rem;
		--radius-base: 0.25rem;
		--radius-md: 0.375rem;
		--radius-lg: 0.5rem;
		--radius-xl: 0.75rem;
		--radius-2xl: 1rem;
		--radius-3xl: 1.5rem;
		--radius-full: 9999px;
	}

	/* Elements */
	.root {
		display: flex;
		max-width: 25rem;
		flex-direction: column;
		overflow: hidden;
		border-radius: 0.75rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.list {
		display: flex;
		flex-shrink: 0;
		overflow-x: auto;
		background-color: var(--neutral-100);
	}

	.trigger {
		display: flex;
		align-items: center;
		justify-content: center;

		cursor: default;
		user-select: none;

		border-radius: 0;
		background-color: var(--neutral-100);

		color: var(--neutral-900);
		font-weight: 500;
		line-height: 1;

		flex: 1;
		height: 3rem;
		padding-inline: 0.5rem;

		position: relative;
		z-index: 10;
	}

	.trigger-indicator {
		position: absolute;
		bottom: 0.25rem;
		left: 50%;
		translate: -50%;
		height: 0.25rem;
		width: 1.5rem;
		border-radius: 999px;
		background-color: var(--magnum-400);
	}

	.content {
		flex-grow: 1;
		padding: 1.25rem;
		background-color: white;
		color: black;
	}

	.content p {
		display: inline-block;
		margin-block-end: 1.25rem;
		color: var(--neutral-900);
	}

	.content fieldset {
		margin-block-end: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: start;
	}

	.content fieldset label {
		/* "mb-2.5 block text-sm leading-none text-neutral-900" */
		margin-block-end: 1.25rem;
		display: block;
	}

	:global([data-state='active']).trigger {
		background-color: white;
		color: var(--magnum-900);
	}

	input {
		height: 2rem;
		flex-shrink: 0;
		flex-grow: 1;
		border-radius: var(--radius-md);
		border: 1px solid var(--neutral-200);
		padding-inline: 0.75rem;
		line-height: 1;
		color: var(--neutral-900);

		&:focus {
			border-color: var(--magnum-400);
		}
	}

	.save {
		display: inline-flex;
		height: 2rem;
		cursor: default;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		background-color: var(--magnum-200);
		padding-inline: 1rem;
		line-height: 1;
		font-weight: 600;
		color: var(--magnum-900);

		/* &:hover {
			opacity: 0.75;
		}

		&:focus {
			@apply !ring-green-600;
		} */
	}
</style>
