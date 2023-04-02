<script lang="ts">
	import { Collapsible } from '$lib';
</script>

<Collapsible.Root {...$$restProps}>
	<Collapsible.Trigger data-testid="trigger">Trigger</Collapsible.Trigger>
	<Collapsible.Content data-testid="content">Content</Collapsible.Content>
</Collapsible.Root>
