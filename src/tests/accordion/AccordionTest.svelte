<script lang="ts">
	import { createAccordion, type CreateAccordionProps, melt } from '$lib/index.js';

	export let multiple = false;
	export let disabled: CreateAccordionProps['disabled'] = undefined;
	export let items: { id: string; triggerId: string; title: string; description: string }[] = [];

	const {
		elements: { root, content, item, trigger },
		helpers: { isSelected },
	} = createAccordion({ multiple, disabled });
</script>

<div use:melt={$root}>
	{#each items as { id, triggerId, title, description }, i}
		<div use:melt={$item(id)} data-testid={id}>
			<h2 class="flex">
				<button data-testid={triggerId} use:melt={$trigger(id)}>
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div use:melt={$content(id)}>
					{description}
				</div>
			{/if}
		</div>
	{/each}
</div>
