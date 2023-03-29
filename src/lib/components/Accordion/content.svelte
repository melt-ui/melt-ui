<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { Collapsible } from '../Collapsible';

	type $$Props = BaseProps;
</script>

<Collapsible.Content {...$$restProps}>
	<slot />
</Collapsible.Content>
