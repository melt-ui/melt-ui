<script lang="ts">
	import { createLinkPreview, melt } from '$lib/index.js';
	import { fly } from 'svelte/transition';

	const {
		elements: { trigger, content, arrow },
		states: { open },
	} = createLinkPreview({
		forceVisible: true,
	});
</script>

<a
	class="trigger"
	href="https://github.com/melt-ui/melt-ui"
	target="_blank"
	rel="noopener noreferrer"
	use:melt={$trigger}
>
	<img src="/logo-mark.svg" alt="Melt UI Logo" />
	<span class="sr-only">Open Melt UI Details</span>
</a>

{#if $open}
	<div
		use:melt={$content}
		transition:fly={{ y: -5, duration: 100 }}
		class="content"
	>
		<div class="content-wrapper">
			<div class="preview">
				<img src="/logo-mark.svg" alt="Melt UI Logo" class="preview-header" />
				<div class="preview-content">
					<div>
						<div class="title">Melt UI</div>
						<div class="alt">melt-ui/melt-ui</div>
					</div>
				</div>
				<div class="preview-body">
					A set of accessible, unstyled component builders for Svelte &
					SvelteKit. Open source.
				</div>
				<div class="preview-footer">
					<div class="stats">
						<div class="stat-value">618</div>
						<div class="stat-label">Stars</div>
					</div>
					<div class="stats">
						<div class="stat-value">37</div>
						<div class="stat-label">Forks</div>
					</div>
				</div>
			</div>
		</div>
		<div use:melt={$arrow} />
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

		--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
		--shadow-xl: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);

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

		--ring-width: 1px;
		--ring-offset-width: 2px;
		--ring-color: var(--magnum-400);
		--ring-offset-color: white;
		--ring-offset-shadow: 0 0 0 var(--ring-offset-width)
			var(--ring-offset-color);
		--ring-shadow: 0 0 0 calc(var(--ring-width) + var(--ring-offset-width))
			var(--ring-color);
	}

	.trigger {
		--bg-opacity: 1;

		display: flex;
		height: 3rem;
		width: 3rem;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		background-color: rgb(255 255 255 / var(--bg-opacity));
		color: var(--magnum-900);
		font-size: var(--fs-sm);
		line-height: 1.25rem;
		font-weight: var(--fw-medium);
		transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.trigger:hover {
		--bg-opacity: 0.9;
	}

	.trigger:focus-visible {
		box-shadow: var(--ring-offset-shadow), var(--ring-shadow) !important;
	}

	.trigger img {
		width: 100%;
		height: 100%;
		border-radius: var(--radius-full);
		background-color: var(--neutral-900);
		object-fit: contain;
		padding: 0.5rem;
		box-sizing: border-box;
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

	.content {
		z-index: 10;
		border-radius: var(--radius-md);
		background-color: white;
		box-shadow: var(--shadow-sm);
	}

	.content-wrapper {
		display: block;
		width: 300px;
		border-radius: var(--radius-md);
		background-color: white;
		padding: 1.25rem;
		box-shadow: var(--shadow-sm);
	}

	.preview {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.preview-header {
		display: block;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: var(--radius-full);
		background-color: var(--neutral-900);
		padding: 0.5rem;
		object-fit: fill;
	}

	.preview-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.title {
		color: var(--neutral-900);
		font-weight: var(--fw-bold);
	}

	.alt {
		color: var(--neutral-400);
	}

	.preview-body {
		color: var(--neutral-700);
	}

	.preview-footer {
		display: flex;
		gap: 1rem;
	}

	.stats {
		display: flex;
		gap: 0.25rem;
	}

	.stat-value {
		color: var(--neutral-900);
	}
	.stat-label {
		color: var(--neutral-400);
	}
</style>
