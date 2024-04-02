<script lang="ts">
	import { createDialog, melt, type CreateDialogProps } from '$lib/index.js';
	import Dialog from './DialogTest.svelte';
	import Combobox from './ComboboxTest.svelte';
	import LinkPreview from './LinkPreviewTest.svelte';
	import Menubar from './MenubarTest.svelte';
	import Menu from './MenuTest.svelte';
	import Popover from './PopoverTest.svelte';
	import Select from './SelectTest.svelte';
	import Tooltip from './TooltipTest.svelte';

	type $$Props = CreateDialogProps;
	export let escapeBehavior: CreateDialogProps['escapeBehavior'] = 'close';

	const {
		elements: { trigger, content, portalled },
		states: { open },
		options: { escapeBehavior: rootEscapeBehavior },
	} = createDialog({ forceVisible: true });

	const setRootEscapeBehaviorIgnore = () => rootEscapeBehavior.set('ignore');
</script>

<button use:melt={$trigger} data-testid="root-dialog-trigger">Open</button>
{#if $open}
	<div use:melt={$portalled}>
		<div use:melt={$content} data-testid="root-dialog-content">
			<Dialog {escapeBehavior} {setRootEscapeBehaviorIgnore} />
			<Combobox {escapeBehavior} {setRootEscapeBehaviorIgnore} />
			<LinkPreview {escapeBehavior} {setRootEscapeBehaviorIgnore} />
			<Menubar {escapeBehavior} {setRootEscapeBehaviorIgnore} />
			<Menu {escapeBehavior} {setRootEscapeBehaviorIgnore} />
			<Popover {escapeBehavior} {setRootEscapeBehaviorIgnore} />
			<Select {escapeBehavior} {setRootEscapeBehaviorIgnore} />
			<Tooltip {escapeBehavior} {setRootEscapeBehaviorIgnore} />
		</div>
	</div>
{/if}
