<script lang="ts" context="module">
	import { Toggle, type ToggleRootProps } from '../Toggle';

	export type ToggleGroupItemProps = ToggleRootProps & {
		value: string;
	};
</script>

<script lang="ts">
	import { useCollection } from '$lib/internal/helpers';
	import { getToggleGroupItemCollection, getToggleGroupRootContext } from './root.svelte';

	type $$Props = ToggleGroupItemProps;
	export let use: $$Props['use'] = [];
	export let value: $$Props['value'];
	export let disabled: $$Props['disabled'] = false;

	const rootCtx = getToggleGroupRootContext();
	const itemCollection = getToggleGroupItemCollection();

	function handleChange(e: CustomEvent<boolean>) {
		const pressed = e.detail;
		if ($rootCtx.type === 'single') {
			$rootCtx.value = pressed ? value : null;
		} else {
			const values = Array.isArray($rootCtx.value) ? $rootCtx.value : [];
			$rootCtx.value = pressed ? [...values, value] : values.filter((v) => v !== value);
		}
	}
</script>

<Toggle.Root
	{...$$restProps}
	use={[
		...(use ?? []),
		[
			useCollection,
			{
				collection: itemCollection,
			},
		],
	]}
	disabled={$rootCtx.disabled || disabled}
	pressed={Array.isArray($rootCtx.value)
		? $rootCtx.value.includes(value)
		: $rootCtx.value === value}
	on:change={(e) => handleChange(e)}
	{...{ ['data-orientation']: $rootCtx.orientation }}
>
	<slot />
</Toggle.Root>
