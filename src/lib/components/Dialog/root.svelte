<!-- Svelte -->
<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';

	export type DialogRootProps = {
		open?: boolean;
		modal?: boolean;
	};

	type DialogRootContext = {
		open: boolean;
	};

	const { getContext, setContext } = reactiveContext<DialogRootContext>();
	export const getDialogRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = DialogRootProps;

	export let open: $$Props['open'] = false;
	const rootCtx = setContext({
		open: [open ?? false, (value) => (open = value)]
	});
	$: typeof open !== 'undefined' && rootCtx.set({ open });
</script>

<slot />
