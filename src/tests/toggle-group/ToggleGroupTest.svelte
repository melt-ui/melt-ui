<script lang="ts" context="module">
	type T = unknown;
</script>

<script lang="ts" generics="T extends 'single' | 'multiple'">
	import { removeUndefined } from '../utils.js';

	import { createToggleGroup, melt, type CreateToggleGroupProps } from '$lib/index.js';

	export let type: T;
	export let defaultValue: CreateToggleGroupProps<T>['defaultValue'] = undefined;
	export let disabled: CreateToggleGroupProps['disabled'] = undefined;
	export let loop: CreateToggleGroupProps['loop'] = undefined;
	export let onValueChange: CreateToggleGroupProps<T>['onValueChange'] = undefined;
	export let orientation: CreateToggleGroupProps['orientation'] = undefined;
	export let items: string[] = ['item-1', 'item-2', 'item-3'];
	export let value: CreateToggleGroupProps<T>['value'] = undefined;

	type $$Props = CreateToggleGroupProps<T> & {
		items: string[];
		type: T;
	};

	const {
		elements: { root, item },
	} = createToggleGroup<T>({
		...removeUndefined({
			type,
			defaultValue,
			disabled,
			loop,
			onValueChange,
			orientation,
			value,
			...$$restProps,
		}),
	});
</script>

<main>
	<button data-testid="tab-btn">Tab Focus Step button</button>
	<div use:melt={$root} aria-label="root-1" data-testid="root">
		{#each items as tItem}
			<button use:melt={$item(tItem)} data-testid={tItem}>
				{tItem}
			</button>
		{/each}
	</div>
</main>
