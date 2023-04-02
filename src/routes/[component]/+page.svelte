<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	import { collapsible } from '../(previews)/collapsible';

	const componentData = collapsible;

	// Construct nested object of props with default values
	let props = Object.entries(componentData.props).reduce(
		(acc, [objectName, props]) => ({
			...acc,
			[objectName]: Object.entries(props).reduce(
				(acc, [propName, prop]) => ({
					...acc,
					[propName]: false
				}),
				{}
			)
		}),
		{}
	);

	$: {
		console.log(props);
	}
	// const props = Object.entries(componentData.props).map(([objectName, props]) =>
	// 	Object.entries(props).map(([propName, prop]) => false)
	// );
</script>

<div class="p-8">
	<div>
		<h2 class="text-xl font-bold">{componentData.title}</h2>
		<span>{componentData.description}</span>
		<div class="preview">
			<svelte:component this={componentData.example} bind:props />
		</div>
		<table class="mt-4 w-full table-auto border-collapse border border-slate-500">
			{#each Object.entries(componentData.props) as [propObject, propEntries]}
				<tr>
					<th class="p-2 text-left">{componentData.title}.{propObject}</th>
				</tr>
				{#each Object.entries(propEntries) as [propKey, propDefinition]}
					<tr>
						<td class="border border-slate-600 p-2 font-mono">{propKey}</td>
						<td class="border border-slate-600 p-2 font-mono">{propDefinition.type}</td>
						<td class="border border-slate-600 p-2 font-mono"
							><input type="checkbox" bind:checked={props[propObject][propKey]} /></td
						>
					</tr>
				{/each}
			{/each}
		</table>
		<div />
	</div>
</div>

<style lang="postcss">
	.preview {
		background-image: linear-gradient(
			330deg,
			theme('colors.purple.500') 0%,
			theme('colors.indigo.800') 100%
		);

		border-radius: theme('borderRadius.lg');

		padding: theme('spacing.8');

		@media screen('md') {
			padding: theme('spacing.16');
		}
	}
</style>
