<script lang="ts" context="module">
	import { useCollection } from '$lib/internal/helpers';
	import { Dialog, type DialogCloseProps } from '../Dialog';
	import { getCancelCollection } from './content.svelte';

	export type AlertDialogActionProps = DialogCloseProps;
</script>

<script lang="ts">
	type $$Props = AlertDialogActionProps;

	const cancelCollection = getCancelCollection();
</script>

<Dialog.Close
	{...$$restProps}
	use={[
		...($$restProps.use ?? []),
		[
			useCollection,
			{
				collection: cancelCollection,
			},
		],
	]}
>
	<slot />
</Dialog.Close>
