<script lang="ts" context="module">
	import { collectionContext } from '$lib/internal/helpers';
	import { Dialog, type DialogContentProps } from '../Dialog';

	export type AlertDialogContentProps = DialogContentProps;

	const cancelCollectionCtx = collectionContext();
	export const getCancelCollection = cancelCollectionCtx.getContext;
</script>

<script lang="ts">
	type $$Props = AlertDialogContentProps;
	const cancelCollection = cancelCollectionCtx.setContext();

	export let openAutoFocus: $$Props['openAutoFocus'] = undefined;
	$: resolvedOpenAutoFocus = openAutoFocus === undefined ? $cancelCollection[0] : true;
</script>

<Dialog.Content
	role="alertdialog"
	on:pointerDownOutside={(e) => {
		e.detail.preventDefault();
	}}
	openAutoFocus={resolvedOpenAutoFocus}
	{...$$restProps}
>
	<slot />
</Dialog.Content>
