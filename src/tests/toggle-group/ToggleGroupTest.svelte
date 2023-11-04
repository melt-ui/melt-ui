<script lang="ts">
	import { createToggleGroup, melt, type CreateToggleGroupProps } from '$lib/index.js';

	type T = $$Generic<'single' | 'multiple'>;

	export let type: T;
	export let defaultValue: CreateToggleGroupProps<T>['defaultValue'] = undefined;
	export let disabled: CreateToggleGroupProps['disabled'] = undefined;
	export let loop: CreateToggleGroupProps['loop'] = undefined;
	export let onValueChange: CreateToggleGroupProps<T>['onValueChange'] = undefined;
	export let orientation: CreateToggleGroupProps['orientation'] = undefined;
	export let items: string[] = ['item-1', 'item-2', 'item-3'];
	export let value: CreateToggleGroupProps<T>['value'] = undefined;

	const {
		elements: { root, item },
	} = createToggleGroup<T>({
		type,
		defaultValue,
		disabled,
		loop,
		onValueChange,
		orientation,
		value,
	});
</script>

<main>
	<div use:melt={$root} aria-label="root-1" data-testid="root">
		{#each items as tItem}
			<button use:melt={$item(tItem)} data-testid={tItem}>
				{tItem}
			</button>
		{/each}
	</div>
</main>
