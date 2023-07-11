<script lang="ts" context="module">
	type TabsContext = Pick<ReturnType<typeof createTabs>, 'content' | 'list' | 'trigger'> & {
		tabs: Writable<string[]>;
	};

	const setTabsContext = (context: TabsContext) => {
		setContext('tabs', context);
	};

	export const getTabsContext = () => getContext<TabsContext>('tabs');
</script>

<script lang="ts">
	import { createTabs } from '$lib';
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let tabs: string[] = [];

	const { root, content, list, trigger, value } = createTabs({
		value: tabs[0],
	});

	$: value.set(tabs[0]);

	const tabsStore = writable(tabs);
	$: tabsStore.update(() => tabs);

	setTabsContext({ content, list, trigger, tabs: tabsStore });
</script>

<div {...$root}>
	<slot tab={$value} />
</div>
