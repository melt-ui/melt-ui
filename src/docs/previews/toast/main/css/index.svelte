<script lang="ts">
	import { createToaster, melt } from '$lib/index.js';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { X } from 'lucide-svelte';

	type ToastData = {
		title: string;
		description: string;
		color: string;
	};

	const {
		elements: { content, title, description, close },
		helpers: { addToast },
		states: { toasts },
		actions: { portal },
	} = createToaster<ToastData>();

	const toastData: ToastData[] = [
		{
			title: 'Success',
			description: 'Congratulations! It worked!',
			color: 'green-500',
		},
		{
			title: 'Warning',
			description: 'Please check again.',
			color: 'orange-500',
		},
		{
			title: 'Error',
			description: 'Something did not work!',
			color: 'red-500',
		},
	];

	function addRandomToast() {
		addToast({
			data: toastData[Math.floor(Math.random() * toastData.length)],
			closeDelay: 0,
		});
	}
</script>

<button class="trigger" on:click={addRandomToast}> Show toast </button>

<div class="container" use:portal>
	{#each $toasts as { id, data } (id)}
		<div
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class="wrapper"
		>
			<div class="toast">
				<div>
					<h3 use:melt={$title(id)} class="heading">
						{data.title}
						<span class="badge {data.color}" />
					</h3>
					<div use:melt={$description(id)}>
						{data.description}
					</div>
				</div>
				<button use:melt={$close(id)} class="close">
					<X style="height: 1rem; width: 1rem" />
				</button>
			</div>
		</div>
	{/each}
</div>

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

		--orange-500: #f97316;
		--red-500: #ef4444;
		--green-500: #22c55e;

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

	.trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-xl);
		background-color: white;
		padding: 0.75rem 1rem;
		font-weight: var(--fw-medium);
		line-height: var(--lh-none);
		color: var(--magnum-700);
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
	}

	.trigger:hover {
		opacity: 0.75;
	}

	.container {
		position: fixed;
		right: 0;
		top: 0;
		z-index: 50;
		margin: 1rem;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
	}
	@media (min-width: 768px) {
		.container {
			bottom: 0;
			top: auto;
		}
	}

	.wrapper {
		border-radius: var(--radius-lg);
		background-color: var(--neutral-800);
		color: white;
		box-shadow: var(--shadow-md);
	}

	.toast {
		position: relative;
		display: flex;
		width: 24rem;
		max-width: calc(100vw - 2rem);
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem;
	}

	.heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: var(--fw-semibold);
	}

	.badge {
		border-radius: var(--radius-full);
		width: 0.375rem;
		height: 0.375rem;
		background-color: var(--bg-color, var(--orange-500));
	}
	.badge.orange-500 {
		--bg-color: var(--orange-500);
	}
	.badge.red-500 {
		--bg-color: var(--red-500);
	}
	.badge.green-500 {
		--bg-color: var(--green-500);
	}

	.close {
		--size: 1.5rem;
		position: absolute;
		right: 1rem;
		top: 1rem;
		display: grid;
		place-items: center;
		border-radius: var(--radius-full);
		color: var(--magnum-500);
		height: var(--size);
		width: var(--size);
	}
	.close:hover {
		background-color: rgb(121 58 21 / 0.5);
	}
</style>
