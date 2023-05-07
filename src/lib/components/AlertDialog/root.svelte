<script lang="ts" context="module">
	import type { DialogRootProps } from '../Dialog';

	export type AlertDialogRootProps = DialogRootProps;
</script>

<script lang="ts">
	import { Dialog } from '../Dialog';

	type $$Props = AlertDialogRootProps;
</script>

<Dialog.Root {...$$restProps}>
	<slot />
</Dialog.Root>
