<script lang="ts">
	import { components, structure, type Structure } from './PortalNested.js';

	export let cmp: Structure = structure;

	$: resolvedCmp = components[cmp.name];
	export let isRoot = true;
</script>

{#if isRoot}
	<main>
		<svelte:component this={resolvedCmp}>
			{#each cmp.children ?? [] as child}
				<svelte:self cmp={child} isRoot={false} />
			{/each}
		</svelte:component>
	</main>
{:else}
	<svelte:component this={resolvedCmp}>
		{#each cmp.children ?? [] as child}
			<svelte:self cmp={child} isRoot={false} />
		{/each}
	</svelte:component>
{/if}
