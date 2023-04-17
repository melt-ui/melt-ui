<script lang="ts" context="module">
	import { Toggle, type ToggleRootProps } from '../Toggle';

	export type ToggleGroupItemProps = ToggleRootProps;
</script>

<script lang="ts">
	type $$Props = ToggleGroupItemProps;
</script>

<Toggle.Root {...$$restProps}>
	<slot />
</Toggle.Root>
