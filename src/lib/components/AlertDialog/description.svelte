<script lang="ts" context="module">
	import { Dialog, type DialogDescriptionProps } from '../Dialog';

	export type AlertDialogDescriptionProps = DialogDescriptionProps;
</script>

<script lang="ts">
	type $$Props = AlertDialogDescriptionProps;
</script>

<Dialog.Description {...$$restProps}>
	<slot />
</Dialog.Description>
