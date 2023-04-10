<script lang="ts" context="module">
	import { focusTrap } from '$lib/internal';
	import { dismissable } from '$lib/internal/actions/dismissable';
	import { removeScroll } from '$lib/internal/actions/removeScroll';
	import type { BaseProps } from '$lib/types';
	import { getDataState } from './internal/helpers';
	import { getDialogRootContext } from './root.svelte';

	export type DialogContentProps = BaseProps<'div'> & {
		onPointerDownOutside?: (event: CustomEvent<{ originalEvent: MouseEvent }>) => void;
		onEscapeKeyDown?: (event: CustomEvent<{ originalEvent: KeyboardEvent }>) => void;
	};
</script>

<script lang="ts">
	type $$Props = DialogContentProps;
	export let onPointerDownOutside: $$Props['onPointerDownOutside'] = undefined;
	export let onEscapeKeyDown: $$Props['onEscapeKeyDown'] = undefined;

	const rootCtx = getDialogRootContext();
</script>

<div
	role="dialog"
	{...$$restProps}
	use:focusTrap={{ disable: !$rootCtx.modal, autofocus: $rootCtx.openAutoFocus }}
	use:dismissable={{
		onPointerDownDismiss: (e) => {
			onPointerDownOutside?.(e);
			if (!e.defaultPrevented) {
				$rootCtx.open = false;
			}
		},
		onEscDismiss: (e) => {
			onEscapeKeyDown?.(e);
			if (!e.defaultPrevented) {
				$rootCtx.open = false;
			}
		},
	}}
	use:removeScroll={{ disable: !$rootCtx.modal }}
	id={$rootCtx.contentId}
	aria-labelledby={$rootCtx.titleId}
	aria-describedby={$rootCtx.descriptionId}
	data-state={getDataState($rootCtx.open)}
>
	<slot />
</div>
