<script lang="ts">
	import { createPopover, melt } from '$lib/index.js';
	import { fade } from 'svelte/transition';
	import { Settings2, X } from 'lucide-svelte';

	const {
		elements: { trigger, content, arrow, close },
		states: { open },
	} = createPopover({
		forceVisible: true,
	});
</script>

<button
	type="button"
	class="trigger"
	use:melt={$trigger}
	aria-label="Update dimensions"
>
	<Settings2 style="height: 1rem; width: 1rem;" />
	<span class="sr-only">Open Popover</span>
</button>

{#if $open}
	<div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
		<div use:melt={$arrow} />
		<div class="wrapper">
			<p>Dimensions</p>
			<fieldset>
				<label for="width">Width</label>
				<input type="number" id="width" class="input" placeholder="Width" />
			</fieldset>
			<fieldset>
				<label for="height">Height</label>
				<input type="number" id="height" class="input" placeholder="Height" />
			</fieldset>
			<fieldset>
				<label for="depth">Depth</label>
				<input type="number" id="depth" class="input" placeholder="Depth" />
			</fieldset>
			<fieldset>
				<label for="weight">Weight</label>
				<input type="number" id="weight" class="input" placeholder="Weight" />
			</fieldset>
		</div>
		<button class="close" use:melt={$close}>
			<X style="height: 1rem; width: 1rem;" />
		</button>
	</div>
{/if}

<style>
	* {
		all: unset;
		box-sizing: border-box;
	}

	/* CSS Variables */
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

		--shadow-sm: 0 1px 2px 0 var(--shadow-color, rgb(0 0 0 / 0.05));
		--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		--shadow-lg: 0 10px 15px -3px var(--shadow-color, rgb(0 0 0 / 0.1)),
			0 4px 6px -4px var(--shadow-color, rgb(0 0 0 / 0.1));
		--shadow-xl: 0 0 #0000, 0 0 #0000,
			0 10px 15px -3px var(--shadow-color, rgb(0 0 0 / 0.1)),
			0 4px 6px -4px var(--shadow-color, rgb(0 0 0 / 0.1));

		--fs-xs: 0.75rem;
		--fs-sm: 0.875rem;
		--fs-base: 1rem;
		--fs-lg: 1.125rem;
		--fs-xl: 1.25rem;
		--fs-2xl: 1.5rem;
		--fs-3xl: 1.875rem;
		--fs-4xl: 2.25rem;
		--fs-5xl: 3rem;
		--fs-6xl: 4rem;
		--fs-7xl: 5rem;
		--fs-8xl: 6rem;
		--fs-9xl: 8rem;

		--fw-thin: 100;
		--fw-extralight: 200;
		--fw-light: 300;
		--fw-normal: 400;
		--fw-medium: 500;
		--fw-semibold: 600;
		--fw-bold: 700;
		--fw-extrabold: 800;
		--fw-black: 900;

		--radius-sm: 0.125rem;
		--radius-base: 0.25rem;
		--radius-md: 0.375rem;
		--radius-lg: 0.5rem;
		--radius-xl: 0.75rem;
		--radius-2xl: 1rem;
		--radius-3xl: 1.5rem;
		--radius-full: 9999px;

		--lh-none: 1;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	fieldset {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	label {
		width: 75px;
		font-size: var(--fs-sm);
		color: var(--neutral-700);
	}

	p {
		margin-bottom: 0.5rem;
		font-weight: var(--fw-medium);
		color: var(--neutral-900);
	}

	.input {
		display: flex;
		height: 2rem;
		width: 100%;
		border-radius: var(--radius-md);
		border: 1px solid var(--magnum-800);
		background-color: transparent;
		padding-inline: 0.625rem;
		font-size: var(--fs-sm);
		flex: 1 1 0%;
		align-items: center;
		justify-content: center;
		padding-inline: 0.625rem;
		font-size: var(--fs-sm);
		line-height: var(--lh-none);
		color: var(--magnum-700);
	}
	.input:focus-visible {
		box-shadow: 0 0 0 4px var(--magnum-400) !important;
	}

	.trigger {
		display: inline-flex;
		height: 2.25rem;
		width: 2.25rem;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		background-color: white;
		padding: 0px;
		font-size: var(--fs-sm);
		line-height: 1.25rem;
		font-weight: var(--fw-medium);
		color: var(--magnum-900);
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}
	.trigger:hover {
		background-color: rgb(255 255 255 / 0.9);
	}
	.trigger:focus-visible {
		box-shadow: 0 0 0 5px rgb(243 141 28 / 0.5) !important;
	}

	.close {
		position: absolute;
		right: 0.375rem;
		top: 0.375rem;
		display: flex;
		height: 1.75rem;
		width: 1.75rem;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		color: var(--magnum-900);
		transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke;
		background-color: white;
		padding: 0px;
		font-size: var(--fs-sm);
		line-height: 1.25rem;
		font-weight: 500;
		cursor: pointer;
	}
	.close:hover {
		background-color: rgb(243 141 28 / 0.1);
	}
	.close:focus-visible {
		box-shadow: 0 0 0 3px var(--magnum-400) !important;
	}

	.content {
		z-index: 10;
		border-radius: var(--radius-base);
		background-color: white;
		padding: 1rem;
		box-shadow: var(--shadow-sm);
	}
</style>
