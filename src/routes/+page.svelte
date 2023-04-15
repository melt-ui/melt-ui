<script lang="ts">
	import ChevronLeft from '~icons/radix-icons/chevron-left';
	import ChevronRight from '~icons/radix-icons/chevron-right';
	import { getPropsObj } from './(previews)/helpers';
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

	let vw = 0;
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

<svelte:window bind:innerWidth={vw} />

<div class="grid grow place-items-center relative">
	<div class="flex flex-col items-center gap-16 w-full overflow-hidden">
		<div class="w-full overflow-hidden">
			<div
				class="wrapper"
				style:--pl={`${(vw - 600) / 2}px`}
				style:--pr={`${(vw - 600) / 2}px`}
				style:--gap={`${GAP}px`}
				on:scroll={handleScroll}
				bind:this={wrapperEl}
			>
				{#each sortedSchemas as [identifier, schema], idx}
					{@const propsObj = getPropsObjForSchema(schema)}
					<div
						class={cn(
							'flex w-full lg:h-[600px] lg:min-w-[600px] flex-col gap-2 overflow-hidden transition lg:opacity-50',
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

		<div class="hidden lg:flex items-center gap-16">
			<button
				class="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-white"
				on:click={handlePrev}
			>
				<ChevronLeft />
			</button>
			<button
				class="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-white"
				on:click={handleNext}
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
		padding: theme('spacing.6');

		@media screen('lg') {
			display: flex;
			overflow-x: scroll;
			width: 100%;
			gap: var(--gap);
			padding-left: var(--pl);
			padding-right: var(--pr);
			padding-block: theme('spacing.16');
			scrollbar-width: none;
		}
	}
</style>
