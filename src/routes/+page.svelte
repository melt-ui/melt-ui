<script lang="ts">
	import Accordion from './(previews)/Accordion.svelte';
	import Collapsible from './(previews)/Collapsible.svelte';
	import Toggle from './(previews)/Toggle.svelte';

	const previews = {
		Accordion,
		Collapsible,
		Toggle
	};
</script>

<div class="wrapper">
	{#each Object.entries(previews) as [title, component]}
		<div class="comp-preview">
			<h2 class="title">{title}</h2>
			<div class="content">
				<svelte:component this={component} />
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
