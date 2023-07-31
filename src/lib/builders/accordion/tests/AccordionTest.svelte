<script lang="ts">
	import { createAccordion, type CreateAccordionProps } from '$lib';

	export let type: CreateAccordionProps['type'] = 'single';
	export let disabled: CreateAccordionProps['disabled'];
	export let items: { id: string; triggerId: string; title: string; description: string }[] = [];

	const { content, item, trigger, isSelected, root } = createAccordion({ type, disabled });
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
