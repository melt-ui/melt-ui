<script lang="ts">
	import { type CreateTabsProps, melt, createTabs } from '$lib/index.js';

	type $$Props = CreateTabsProps & {
		tabValues: string[];
	};

	export let tabValues: string[] = [];

	const {
		elements: { content, root, list, trigger },
	} = createTabs({
		...($$restProps as $$Props),
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
