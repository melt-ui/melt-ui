<script lang="ts" context="module">
	import type { DialogRootProps } from '../Dialog';

	export type AlertDialogRootProps = Omit<DialogRootProps, 'modal'>;
</script>

<script lang="ts">
	import { Dialog } from '../Dialog';

	type $$Props = AlertDialogRootProps;
</script>

<Dialog.Root {...$$restProps} modal>
	<slot />
</Dialog.Root>
