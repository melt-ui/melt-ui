<script lang="ts">
	import { createDialog, melt, type CreateDialogProps } from '$lib/index.js';
	import Combobox from './ComboboxTest.svelte';
	import Menubar from './MenubarTest.svelte';
	import Menu from './MenuTest.svelte';
	import Popover from './PopoverTest.svelte';
	import Select from './SelectTest.svelte';

	type $$Props = CreateDialogProps;
	export let clickOutsideBehavior: CreateDialogProps['clickOutsideBehavior'] = 'close';

	const {
		elements: { trigger, content, portalled, overlay },
		states: { open },
	} = createDialog({ forceVisible: true, portal: 'body' });
</script>

<button use:melt={$trigger} data-testid="root-dialog-trigger">Open</button>
{#if $open}
	<div use:melt={$portalled}>
		<div
			use:melt={$overlay}
			data-testid="root-dialog-overlay"
			class="fixed inset-0 z-50 bg-black/50"
		/>
		<div
			use:melt={$content}
			data-testid="root-dialog-content"
			class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 p-6 shadow-lg"
		>
			<Combobox {clickOutsideBehavior} />
			<Menubar {clickOutsideBehavior} />
			<Menu {clickOutsideBehavior} />
			<Popover {clickOutsideBehavior} />
			<Select {clickOutsideBehavior} />
		</div>
	</div>
{/if}
