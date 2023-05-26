<script lang="ts" context="module">
	import { focusTrap } from '$lib/internal/actions';
	import { dismissable, type ForwardedEvent } from '$lib/internal/actions/dismissable';
	import { removeScroll } from '$lib/internal/actions/removeScroll';
	import { focus, useActions } from '$lib/internal/helpers';
	import type { BaseProps, UnwrapCustomEvents } from '$lib/internal/types';
	import { createEventDispatcher, tick } from 'svelte';
	import { getDataState } from './internal/helpers';
	import { getDialogRootContext } from './root.svelte';

	export type DialogContentProps = BaseProps<'div'> & {
		openAutoFocus?: boolean | HTMLElement;
		closeAutoFocus?: boolean;
	};
</script>

<script lang="ts">
	type $$Props = DialogContentProps;
	type $$Events = {
		pointerDownOutside: ForwardedEvent<MouseEvent>;
		escapeKeyDown: ForwardedEvent<KeyboardEvent>;
	};
	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

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
		onPointerDownOutside: (event) => {
			dispatch('pointerDownOutside', event.detail);
		},
		onEscapeKeyDown: (event) => {
			dispatch('escapeKeyDown', event.detail);
		},
		onDismiss: () => {
			$rootCtx.open = false;
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
