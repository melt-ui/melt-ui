<script lang="ts" context="module">
	export type AccordionHeaderProps = BaseProps;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/types';

	type $$Props = AccordionHeaderProps;
</script>

<h3 {...$$restProps}>
	<slot />
</h3>
