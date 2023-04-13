<script>
	import { Tabs } from '..';
</script>

<div>
	<Tabs.Root value="tab1">
		<Tabs.List aria-label="Tab List">
			<Tabs.Trigger value="tab1">Trigger 1</Tabs.Trigger>
			<Tabs.Trigger value="tab2">Trigger 2</Tabs.Trigger>
			<Tabs.Trigger value="tab3">Trigger 3</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="tab1">Tab 1</Tabs.Content>
		<Tabs.Content value="tab2">Tab 2</Tabs.Content>
		<Tabs.Content value="tab3">Tab 3</Tabs.Content>
	</Tabs.Root>
</div>
