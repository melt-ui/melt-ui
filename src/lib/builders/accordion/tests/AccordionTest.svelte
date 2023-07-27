<script lang="ts">
	import { createAccordion, type CreateAccordionProps } from '@melt-ui/svelte';

	export let type: 'single' | 'multiple' = 'single';
	export let disabled: CreateAccordionProps['disabled'] = undefined;
	export let items: { id: string; triggerId: string; title: string; description: string }[] = [];

	const {
		elements: { root, content, item, trigger },
		helpers: { isSelected },
	} = createAccordion({ type, disabled });
</script>

<div melt={$root}>
	{#each items as { id, triggerId, title, description }, i}
		<div melt={$item(id)} data-testid={id}>
			<h2 class="flex">
				<button data-testid={triggerId} melt={$trigger(id)}>
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div melt={$content(id)}>
					{description}
				</div>
			{/if}
		</div>
	{/each}
</div>
