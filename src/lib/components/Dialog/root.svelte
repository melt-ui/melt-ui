<script lang="ts" context="module">
	import { generateId } from '$lib/internal/helpers';
	import { reactiveContext } from '$lib/internal/helpers';

	export type DialogRootProps = {
		open?: boolean;
		modal?: boolean;
	};

	type DialogRootContext = {
		open: boolean;
		modal: boolean;
		triggeredId: string | null;
		readonly titleId: string;
		readonly descriptionId: string;
		readonly contentId: string;
	};

	const { getContext, setContext, defaults } = reactiveContext<DialogRootContext>({
		open: false,
		modal: true,
		titleId: generateId(),
		descriptionId: generateId(),
		contentId: generateId(),
		triggeredId: null,
	});
	export const getDialogRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = DialogRootProps;

	export let open: $$Props['open'] = defaults?.open;
	export let modal: $$Props['modal'] = defaults?.modal;

	const rootCtx = setContext({
		open: (v) => (open = v),
		modal: (v) => (modal = v),
	});
	// We need this as a dependency for some reason, otherwise it won't open.
	// TODO: figure out why

	$: rootCtx.update((v) => ({ ...v, open, modal }));
</script>

<slot />
