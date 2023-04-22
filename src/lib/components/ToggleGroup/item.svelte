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
	export let value: $$Props['value'];

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
		...($$restProps.use || []),
		[
			useCollection,
			{
				collection: itemCollection,
			},
		],
	]}
	pressed={Array.isArray($rootCtx.value)
		? $rootCtx.value.includes(value)
		: $rootCtx.value === value}
	on:change={(e) => handleChange(e)}
>
	<slot />
</Toggle.Root>
