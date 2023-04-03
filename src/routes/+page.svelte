<script lang="ts">
	import schemas from './(previews)/schemas';
</script>

<div class="wrapper">
	{#each Object.entries(schemas) as [title, schema]}
		<div class="comp-preview">
			<a href={`/${title}`} class="flex items-baseline justify-between">
				<h2 class="title capitalize">{title}</h2>
				<span class="text-sm text-slate-300">View docs</span></a
			>
			<div class="content">
				<svelte:component this={schema.example} />
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
		}
	}
</style>
