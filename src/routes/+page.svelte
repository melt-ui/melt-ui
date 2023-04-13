<script lang="ts">
	import { getPropsObj } from './(previews)/helpers';
	import { internal, components } from './(previews)/schemas';

	const categories = {
		components,
		internal,
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function getPropsObjForSchema(schema: (typeof components)[keyof typeof components]): any {
		// eslint-disable-next-line @typescript-eslint/ban-types
		return getPropsObj<{}>(schema.meta);
	}

	$: categoriesWithSortedEntries = Object.entries(categories).map(([category, schemas]) => {
		const sortedEntries = Object.entries(schemas).sort((a, b) => {
			return a[1].title.toLowerCase().localeCompare(b[1].title.toLowerCase());
		});
		return [category, sortedEntries];
	});
</script>

<main>
	{#each categoriesWithSortedEntries as [category, schemas]}
		<h2 class="mb-4 mt-8 first:hidden text-3xl font-bold capitalize text-white">{category}</h2>
		<div class="wrapper">
			{#each schemas as [identifier, schema]}
				{@const propsObj = getPropsObjForSchema(schema)}
				<div class="flex h-full flex-col gap-2 overflow-hidden">
					<a href={`/${identifier}`} class="flex items-baseline justify-between">
						<h2 class="text-2xl font-normal capitalize text-white">{schema.title}</h2>
						<span class="text-sm text-slate-300">View docs</span></a
					>
					<div class="comp-preview grow place-items-center">
						<svelte:component this={schema.example} {propsObj} />
					</div>
				</div>
			{/each}
		</div>
	{/each}

	<style lang="postcss">
		main {
			padding: theme('spacing.4');
		}

		.wrapper {
			display: grid;
			gap: theme('spacing.8');

			@media screen('md') {
				grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
				grid-auto-rows: minmax(400px, auto);
			}
		}
	</style>
</main>
