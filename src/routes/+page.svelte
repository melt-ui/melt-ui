<script lang="ts">
	import { getPropsObj } from './(previews)/helpers';
	import schemas from './(previews)/schemas';

	function getPropsObjForSchema(schema: (typeof schemas)[keyof typeof schemas]): any {
		return getPropsObj<{}>(schema.meta);
	}
</script>

<div class="wrapper">
	{#each Object.entries(schemas) as [title, schema]}
		{@const propsObj = getPropsObjForSchema(schema)}
		<div class="flex h-full flex-col gap-2 overflow-hidden">
			<a href={`/${title}`} class="flex items-baseline justify-between">
				<h2 class="text-2xl font-bold capitalize text-white">{title}</h2>
				<span class="text-sm text-slate-300">View docs</span></a
			>
			<div class="comp-preview grow place-items-center">
				<svelte:component this={schema.example} {propsObj} />
			</div>
		</div>
	{/each}
</div>

<style lang="postcss">
	.wrapper {
		display: grid;
		padding: theme('spacing.4');
		gap: theme('spacing.8');

		@media screen('md') {
			grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
			grid-template-rows: repeat(auto-fill, minmax(400px, 1fr));
		}
	}
</style>
