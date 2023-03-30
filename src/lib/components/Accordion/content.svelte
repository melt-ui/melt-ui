<script lang="ts" context="module">
	export type AccordionContentProps = CollapsibleContentProps;
</script>

<script lang="ts">
	import type { CollapsibleContentProps } from '../Collapsible';
	import { Collapsible } from '../Collapsible';

	type $$Props = AccordionContentProps;
</script>

<Collapsible.Content {...$$restProps}>
	<slot />
</Collapsible.Content>
