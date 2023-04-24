<script lang="ts">
	import { getPropsObj } from '$lib/internal/helpers';
	import { schemas } from './(previews)/schemas';
	import { cn } from './helpers';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function getPropsObjForSchema(schema: (typeof schemas)[keyof typeof schemas]): any {
		// eslint-disable-next-line @typescript-eslint/ban-types
		return getPropsObj<{}>(schema.meta);
	}

	$: sortedSchemas = Object.entries(schemas).sort((a, b) => {
		return a[1].title.toLowerCase().localeCompare(b[1].title.toLowerCase());
	});

	function copyNpmCommand() {
		navigator.clipboard.writeText(`npm install radix-ui-svelte`);
	}
</script>

<div class="relative grid grow place-items-center p-6">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
		<div class="col-span-full flex flex-col gap-4 py-24">
			<h1 class="text-4xl font-bold text-white lg:text-5xl">Don’t reinvent the wheel.</h1>
			<p class="text-lg text-white opacity-75 lg:text-xl">
				Unstyled, accessible components for building high‑quality design systems and web apps, now
				in Svelte.
			</p>
			<div class="flex flex-row gap-4">
				<button
					on:click={copyNpmCommand}
					class="text-md rounded bg-neutral-900 p-4 font-mono text-white transition hover:bg-neutral-800 active:translate-y-1"
					>npm install radix-svelte</button
				>
				<a
					href="/docs/accordion"
					class="text-md rounded border border-vermilion-500 p-4 font-sans text-white transition hover:bg-neutral-800 active:translate-y-1"
				>
					Read the docs
				</a>
			</div>
		</div>
		{#each sortedSchemas as [identifier, schema], idx}
			{@const propsObj = getPropsObjForSchema(schema)}
			<div
				class={cn(
					'flex min-h-[256px] w-full flex-col gap-2 overflow-hidden transition lg:h-[512px] lg:max-w-[512px]'
				)}
			>
				<a href={`/docs/${identifier}`} class="flex items-baseline justify-between">
					<h2 class="text-xl font-normal capitalize text-white">{schema.title}</h2>
					<span class="text-md text-white opacity-75 hover:opacity-100">View docs</span></a
				>
				<div class="comp-preview grow place-items-center">
					<svelte:component this={schema.example} {propsObj} />
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.wrapper {
		display: grid;
		gap: theme('spacing.4');
		padding: theme('spacing.6');

		@media screen('lg') {
			display: flex;
			overflow-x: scroll;
			width: 100%;
			gap: var(--gap);
			padding-left: calc(calc(100vw - 600px) / 2);
			padding-right: calc(calc(100vw - 600px) / 2);
			padding-block: theme('spacing.16');
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}
	}

	.button {
		display: grid;
		place-items: center;

		width: theme('width.9');
		height: theme('height.9');

		background-color: theme('colors.zinc.700');
		border-radius: theme('borderRadius.full');
		color: theme('colors.white');

		outline: none;

		&:focus {
			@apply ring ring-vermilion-600;
		}

		&:disabled {
			opacity: 0.5;
		}

		&:hover:not(:disabled) {
			background-color: theme('colors.zinc.800');
		}
	}
</style>
