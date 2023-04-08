<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';
	import { generateId } from '$lib/internal';

	export type DialogRootProps = {
		open?: boolean;
		modal?: boolean;
	};

	type DialogRootContext = {
		open: boolean;
		readonly titleId: string;
		readonly descriptionId: string;
		readonly contentId: string;
	};

	const { getContext, setContext } = reactiveContext<DialogRootContext>();
	export const getDialogRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = DialogRootProps;

	export let open: $$Props['open'] = false;
	const rootCtx = setContext({
		open: [open ?? false, (value) => (open = value)],
		titleId: [generateId()],
		descriptionId: [generateId()],
		contentId: [generateId()]
	});
	$: typeof open !== 'undefined' && ($rootCtx.open = open);
</script>

<slot />
