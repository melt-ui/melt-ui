<script lang="ts">
	import { createTooltip } from '$lib';
	import { createToolbar } from '$lib';
	import { Docs } from '$routes/(components)';
	import { fade } from 'svelte/transition';
	import Plus from '~icons/lucide/plus';

	const { root, toggleGroup, toggleItem } = createToolbar({});
</script>

<Docs.PreviewWrapper>
	<div {...root}>
		<div {...$toggleGroup()}>
			<button {...$toggleItem()}>Hey</button>
			<button {...$toggleItem()}>Ho</button>
		</div>
		<div {...$toggleGroup()}>
			<button {...$toggleItem()}>Hi</button>
			<button {...$toggleItem()}>He</button>
		</div>
	</div>
</Docs.PreviewWrapper>

<style lang="postcss">
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90 focus-visible:outline-none;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}
</style>
