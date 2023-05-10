<script lang="ts" context="module">
	import { Dialog, type DialogPortalProps } from '../Dialog';
	export type AlertDialogPortalProps = DialogPortalProps;
</script>

<script lang="ts">
	type $$Props = AlertDialogPortalProps;
</script>

<Dialog.Portal {...$$restProps}>
	<slot />
</Dialog.Portal>
