<script lang="ts">
	import ChevronLeft from '~icons/radix-icons/chevron-left';
	import ChevronRight from '~icons/radix-icons/chevron-right';
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

	let scrollX = 0;
	let wrapperEl: HTMLElement;

	const handleScroll = (e: Event) => {
		scrollX = (e.target as HTMLElement).scrollLeft;
	};

	// TODO: Improve
	$: activeIndex = Math.floor((scrollX + 300 + GAP / 2) / (600 + GAP));

	const GAP = 64;

	function handlePrev() {
		const newIndex = Math.max(activeIndex - 1, 0);
		// Take the gap into account
		wrapperEl.scrollTo({
			left: newIndex * 600 + GAP * newIndex,
			behavior: 'smooth',
		});
	}

	function handleNext() {
		const newIndex = Math.min(activeIndex + 1, sortedSchemas.length - 1);
		wrapperEl.scrollTo({
			left: newIndex * 600 + GAP * newIndex,
			behavior: 'smooth',
		});
	}
</script>

<div class="relative grid grow place-items-center">
	<div class="flex w-full flex-col items-center gap-16 overflow-hidden py-2">
		<div class="w-full overflow-hidden">
			<div
				class="wrapper scroll-h"
				style:--gap={`${GAP}px`}
				on:scroll={handleScroll}
				bind:this={wrapperEl}
			>
				{#each sortedSchemas as [identifier, schema], idx}
					{@const propsObj = getPropsObjForSchema(schema)}
					<div
						class={cn(
							'flex w-full flex-col gap-2 overflow-hidden transition lg:h-[600px] lg:min-w-[600px] lg:opacity-50',
							activeIndex === idx && 'lg:scale-105 lg:opacity-100'
						)}
					>
						<a href={`/docs/${identifier}`} class="flex items-baseline justify-between">
							<h2 class="text-2xl font-normal capitalize text-white">{schema.title}</h2>
							<span class="text-sm text-slate-300">View docs</span></a
						>
						<div class="comp-preview grow place-items-center">
							<svelte:component this={schema.example} {propsObj} />
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="hidden items-center gap-16 lg:flex">
			<button class="button" on:click={handlePrev} disabled={activeIndex === 0}>
				<ChevronLeft />
			</button>
			<button
				class="button"
				on:click={handleNext}
				disabled={activeIndex === sortedSchemas.length - 1}
			>
				<ChevronRight />
			</button>
		</div>
	</div>
</div>

<style lang="postcss">
	.wrapper {
		display: grid;
		gap: theme('spacing.4');
		padding: theme('spacing.2');

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
