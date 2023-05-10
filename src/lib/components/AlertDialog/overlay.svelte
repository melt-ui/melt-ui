<script lang="ts" context="module">
	import { Dialog, type DialogOverlayProps } from '../Dialog';

	export type AlertDialogOverlayProps = DialogOverlayProps;
</script>

<script lang="ts">
	type $$Props = AlertDialogOverlayProps;
</script>

<Dialog.Overlay {...$$restProps}>
	<slot />
</Dialog.Overlay>
