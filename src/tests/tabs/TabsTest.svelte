<script lang="ts">
	import { type CreateTabsProps, melt, createTabs } from '$lib/index.js';

	export let activateOnFocus: CreateTabsProps['activateOnFocus'] = undefined;
	export let autoSet: CreateTabsProps['autoSet'] = undefined;
	export let defaultValue: CreateTabsProps['defaultValue'] = undefined;
	export let loop: CreateTabsProps['loop'] = undefined;
	export let onValueChange: CreateTabsProps['onValueChange'] = undefined;
	export let orientation: CreateTabsProps['orientation'] = undefined;
	export let value: CreateTabsProps['value'] = undefined;
	export let tabValues: string[] = [];

	const {
		elements: { content, root, list, trigger },
	} = createTabs({
		activateOnFocus,
		autoSet,
		defaultValue,
		loop,
		onValueChange,
		orientation,
		value,
	});
</script>

<main>
	<div use:melt={$root} data-testid="root">
		<div use:melt={$list} data-testid="list">
			{#each tabValues as tab}
				<button use:melt={$trigger(tab)} data-testid="{tab}-trigger">
					{tab}
				</button>
			{/each}
		</div>
		{#each tabValues as tab}
			<div use:melt={$content(tab)} data-testid="{tab}-content">
				{tab}
			</div>
		{/each}
	</div>
</main>
