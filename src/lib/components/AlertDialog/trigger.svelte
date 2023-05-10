<script lang="ts" context="module">
	import { Dialog, type DialogTriggerProps } from '../Dialog';

	export type AlertDialogTriggerProps = DialogTriggerProps;
</script>

<script lang="ts">
	type $$Props = AlertDialogTriggerProps;
</script>

<Dialog.Trigger {...$$restProps}>
	<slot />
</Dialog.Trigger>
