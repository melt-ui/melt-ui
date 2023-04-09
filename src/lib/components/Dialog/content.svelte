<script lang="ts" context="module">
	import { focusTrap } from '$lib/internal';
	import { dismissable } from '$lib/internal/actions/dismissable';
	import { removeScroll } from '$lib/internal/actions/removeScroll';
	import type { BaseProps } from '$lib/types';
	import { getDataState } from './internal/helpers';
	import { getDialogRootContext } from './root.svelte';

	export type DialogContentProps = BaseProps;
</script>

<script lang="ts">
	type $$Props = DialogContentProps;

	const rootCtx = getDialogRootContext();
</script>

<div
	role="dialog"
	{...$$restProps}
	use:focusTrap={{ disable: !$rootCtx.modal }}
	use:dismissable={{ onDismiss: () => ($rootCtx.open = !$rootCtx.open) }}
	use:removeScroll={{ disable: !$rootCtx.modal }}
	id={$rootCtx.contentId}
	aria-labelledby={$rootCtx.titleId}
	aria-describedby={$rootCtx.descriptionId}
	data-state={getDataState($rootCtx.open)}
>
	<slot />
</div>
