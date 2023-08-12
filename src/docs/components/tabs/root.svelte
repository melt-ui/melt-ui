<script lang="ts" context="module">
	type CreateTabs = ReturnType<typeof createTabs>;
	type Elements = CreateTabs['elements'];

	type TabsContext = Pick<Elements, 'content' | 'list' | 'trigger'> & {
		tabs: Writable<string[]>;
	};

	const setTabsContext = (context: TabsContext) => {
		setContext('tabs', context);
	};

	export const getTabsContext = () => getContext<TabsContext>('tabs');
</script>

<script lang="ts">
	import { createTabs, melt } from '$lib/index.js';
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let tabs: string[] = [];
	const value = writable(tabs[0]);

	const {
		elements: { root, content, list, trigger },
	} = createTabs({
		value,
	});

	$: value.set(tabs[0]);

	const tabsStore = writable(tabs);
	$: tabsStore.update(() => tabs);

	setTabsContext({ content, list, trigger, tabs: tabsStore });
</script>

<div use:melt={$root}>
	<slot tab={$value} />
</div>
