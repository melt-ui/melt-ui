<script lang="ts" context="module">
	type TabsContext = Pick<ReturnType<typeof createTabs>, 'content' | 'list' | 'trigger'> & {
		tabs: string[];
	};

	const setTabsContext = (context: TabsContext) => {
		setContext('tabs', context);
	};

	export const getTabsContext = () => getContext<TabsContext>('tabs');
</script>

<script lang="ts">
	import { createTabs } from '$lib';
	import { getContext, setContext } from 'svelte';

	export let tabs: string[] = [];

	const { root, content, list, trigger, value } = createTabs({
		value: tabs[0],
	});
	$: value.set(tabs[0]);

	setTabsContext({ content, list, trigger, tabs });
</script>

<div {...$root}>
	<slot tab={$value} />
</div>
