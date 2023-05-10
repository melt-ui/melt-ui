<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';
	import type { DialogTitleProps } from '../Dialog';

	export type AlertDialogTitleProps = DialogTitleProps;
</script>

<script lang="ts">
	import { Dialog } from '../Dialog';

	type $$Props = AlertDialogTitleProps;
</script>

<Dialog.Title {...$$restProps}>
	<slot />
</Dialog.Title>
