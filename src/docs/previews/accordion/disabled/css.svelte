<script lang="ts">
	import { createAccordion, melt } from '$lib';
	import { slide } from 'svelte/transition';

	const {
		elements: { root, content, item, trigger },
		helpers: { isSelected },
	} = createAccordion();

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			description: 'Yes. It adheres to the WAI-ARIA design pattern.',
			disabled: false,
		},
		{
			id: 'item-2',
			title: "I'm a disabled accordion item",
			description: "You can't open me.",
			disabled: true,
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			description:
				'Yes! You can use the transition prop to configure the animation.',
			disabled: false,
		},
	];
</script>

<div class="root" use:melt={$root}>
	{#each items as { id, title, description, disabled }, i}
		<div use:melt={$item(id)} class="item">
			<h2>
				<button use:melt={$trigger({ value: id, disabled })} class="trigger">
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
		max-width: var(--tw-width-md);
		border-radius: var(--tw-border-radius-md);
		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
	}

	.item {
		margin-top: var(--tw-size-px);
		overflow: hidden;
		transition-property: color, background-color, border-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke;
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke, -webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.item:first-child {
		margin-top: var(--tw-size-0);
		border-top-left-radius: var(--tw-border-radius-default);
		border-top-right-radius: var(--tw-border-radius-default);
	}

	.item:last-child {
		border-bottom-right-radius: var(--tw-border-radius-default);
		border-bottom-left-radius: var(--tw-border-radius-default);
	}

	.item:focus-within {
		position: relative;
		z-index: 10;
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
			var(--tw-ring-offset-width) var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0
			calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
			var(--tw-shadow, 0 0 #0000);
		--tw-ring-opacity: 1;
		--tw-ring-color: rgb(var(--tw-color-magnum-400) / var(--tw-ring-opacity));
	}

	.item > h2 {
		display: flex;
	}

	.trigger {
		display: flex;
		height: var(--tw-size-12);
		flex: 1 1 0%;
		cursor: pointer;
		align-items: center;
		justify-content: space-between;
		--tw-bg-opacity: 1;
		background-color: rgb(var(--tw-color-white) / var(--tw-bg-opacity));
		padding-left: var(--tw-size-5);
		padding-right: var(--tw-size-5);
		font-size: var(--tw-font-size-base);
		line-height: var(--tw-line-height-6);
		font-weight: var(--tw-font-weight-medium);
		line-height: var(--tw-line-height-none);
		--tw-text-opacity: 1;
		color: rgb(var(--tw-color-magnum-700) / var(--tw-text-opacity));
		--tw-shadow: 0 1px 0;
		--tw-shadow-colored: 0 1px 0 var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
		transition-property: color, background-color, border-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke;
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke, -webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.trigger:hover {
		--tw-bg-opacity: 0.95;
	}

	.content {
		overflow: hidden;
		--tw-bg-opacity: 1;
		background-color: rgb(var(--tw-color-neutral-100) / var(--tw-bg-opacity));
		font-size: var(--tw-font-size-sm);
		line-height: var(--tw-line-height-5);
		--tw-text-opacity: 1;
		color: rgb(var(--tw-color-neutral-900) / var(--tw-text-opacity));
	}

	.content > div {
		padding-left: var(--tw-size-5);
		padding-right: var(--tw-size-5);
		padding-top: var(--tw-size-4);
		padding-bottom: var(--tw-size-4);
	}
</style>
