<script lang="ts" context="module">
	import { focusTrap } from '$lib/internal/actions';
	import { dismissable } from '$lib/internal/actions/dismissable';
	import { removeScroll } from '$lib/internal/actions/removeScroll';
	import type { BaseProps } from '$lib/internal/types';
	import { tick } from 'svelte';
	import { getDataState } from './internal/helpers';
	import { getDialogRootContext } from './root.svelte';
	import { focus, useActions } from '$lib/internal/helpers';

	export type DialogContentProps = BaseProps<'div'> & {
		onPointerDownOutside?: (event: CustomEvent<{ originalEvent: MouseEvent }>) => void;
		onEscapeKeyDown?: (event: CustomEvent<{ originalEvent: KeyboardEvent }>) => void;
		openAutoFocus?: boolean | HTMLElement;
		closeAutoFocus?: boolean;
	};
</script>

<script lang="ts">
	type $$Props = DialogContentProps;
	export let onPointerDownOutside: $$Props['onPointerDownOutside'] = undefined;
	export let onEscapeKeyDown: $$Props['onEscapeKeyDown'] = undefined;

	export let openAutoFocus: $$Props['openAutoFocus'] = true;
	export let closeAutoFocus: $$Props['closeAutoFocus'] = true;
	export let use: $$Props['use'] = [];

	const rootCtx = getDialogRootContext();

	$: if (!$rootCtx.open && $rootCtx.triggeredId && closeAutoFocus) {
		tick().then(() => {
			focus(`#${$rootCtx.triggeredId}`);
			$rootCtx.triggeredId = null;
		});
	}
</script>

<div
	role="dialog"
	{...$$restProps}
	use:focusTrap={{ disable: !$rootCtx.modal, autofocus: openAutoFocus }}
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
	use:useActions={use ?? []}
>
	<slot />
</div>
