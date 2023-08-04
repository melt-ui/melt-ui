<script lang="ts">
	import { createAccordion, melt } from '$lib/index.js';
	import { slide } from 'svelte/transition';

	const {
		elements: { root, content, item, trigger },
		helpers: { isSelected },
	} = createAccordion({
		multiple: true,
	});

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			description: 'Yes. It adheres to the WAI-ARIA design pattern.',
		},
		{
			id: 'item-2',
			title: 'Is it unstyled?',
			description:
				"Yes. It's unstyled by default, giving you freedom over the look and feel.",
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			description:
				'Yes! You can use the transition prop to configure the animation.',
		},
	];
</script>

<div class="root" use:melt={$root}>
	{#each items as { id, title, description }, i}
		<div use:melt={$item(id)} class="item">
			<h2>
				<button use:melt={$trigger(id)} class="trigger">
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div class="content" use:melt={$content(id)} transition:slide>
					<div>{description}</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.root {
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		max-width: 28rem;
		border-radius: 0.375rem;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.item {
		margin-top: 1px;
		overflow: hidden;
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke, -webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.item:first-child {
		margin-top: 0px;

		border-radius: 0.25rem 0.25rem 0 0;
	}

	.item:last-child {
		border-radius: 0 0 0.25rem 0.25rem;
	}

	.item:focus-within {
		position: relative;
		z-index: 10;

		box-shadow: 0 0 0 3px rgb(var(--color-magnum-400) / 1);
	}

	.item > h2 {
		display: flex;
	}

	.trigger {
		display: flex;
		height: 3rem;
		flex: 1 1 0%;
		cursor: pointer;
		align-items: center;
		justify-content: space-between;

		background-color: rgb(var(--color-white) / 1);

		padding: 0 1.25rem;

		font-size: 1rem;
		font-weight: 500;
		line-height: 1;

		color: rgb(var(--color-magnum-700) / 1);

		box-shadow: none;

		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke, -webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.trigger:hover {
		background-color: rgb(var(--color-white) / 0.95);
	}

	.content {
		overflow: hidden;
		background-color: rgb(var(--color-neutral-100) / 1);
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: rgb(var(--color-neutral-900) / 1);
	}

	.content > div {
		padding: 1rem 1.25rem;
	}
</style>
