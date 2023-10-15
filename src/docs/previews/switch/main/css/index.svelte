<script lang="ts">
	import { createSwitch, melt } from '$lib/index.js';

	const {
		elements: { root, input },
	} = createSwitch();
</script>

<form>
	<div class="wrapper">
		<label for="airplane-mode" id="airplane-mode-label"> Airplane mode </label>
		<button
			use:melt={$root}
			id="airplane-mode"
			aria-labelledby="airplane-mode-label"
		>
			<span class="thumb" />
		</button>
		<input use:melt={$input} />
	</div>
</form>

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

		--ring-width: 1px;
		--ring-offset-width: 2px;
		--ring-color: var(--magnum-400);
		--ring-offset-color: #fff;
		--ring-offset-shadow: 0 0 0 var(--ring-offset-width)
			var(--ring-offset-color);
		--ring-shadow: 0 0 0 calc(var(--ring-width) + var(--ring-offset-width))
			var(--ring-color);
	}

	.wrapper {
		display: flex;
		align-items: center;
	}

	label {
		padding-right: 1rem;
		line-height: var(--lh-none);
		color: var(--magnum-900);
	}

	button {
		--w: 2.75rem;
		--padding: 0.125rem;
		width: var(--w);
		height: 1.5rem;
		cursor: default;
		border-radius: var(--radius-full);
		background-color: var(--magnum-800);
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.thumb {
		--size: 1.25rem;
		width: var(--size);
		height: var(--size);
		display: block;
		border-radius: var(--radius-full);
		background-color: white;
		transform: translateX(var(--padding));
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke, opacity, box-shadow, transform,
			filter, backdrop-filter;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	:global([data-state='checked']):is(button) {
		background-color: var(--magnum-950);
	}

	:global([data-state='checked']) .thumb {
		transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
	}
</style>
