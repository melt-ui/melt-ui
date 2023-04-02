<script>
	import { Accordion } from '../index';

	const ITEMS = ['One', 'Two', 'Three'];
</script>

<div data-testid="TEST">
	<Accordion.Root {...$$restProps}>
		{#each ITEMS as val}
			<Accordion.Item value={val} data-testid={`item-${val.toLowerCase()}`}>
				<Accordion.Header data-testid={`header-${val.toLowerCase()}`}>
					<Accordion.Trigger>Trigger {val}</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content>Content {val}</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>
