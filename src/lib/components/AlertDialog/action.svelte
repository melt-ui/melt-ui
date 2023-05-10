<script lang="ts" context="module">
	import { Dialog, type DialogCloseProps } from '../Dialog';

	export type AlertDialogActionProps = DialogCloseProps;
</script>

<script lang="ts">
	type $$Props = AlertDialogActionProps;
</script>

<Dialog.Close {...$$restProps}>
	<slot />
</Dialog.Close>
