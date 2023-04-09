<script lang="ts" context="module">
	import { focus } from '$lib/helpers/dom';
	import { reactiveContext } from '$lib/helpers/reactiveContext';
	import { generateId } from '$lib/internal';
	import { tick } from 'svelte';

	export type DialogRootProps = {
		open?: boolean;
		modal?: boolean;
	};

	type DialogRootContext = {
		open: boolean;
		modal: boolean;
		readonly titleId: string;
		readonly descriptionId: string;
		readonly contentId: string;
		triggeredId: string | null;
	};

	const { getContext, setContext } = reactiveContext<DialogRootContext>();
	export const getDialogRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = DialogRootProps;

	export let open: $$Props['open'] = false;
	export let modal: $$Props['modal'] = false;

	const rootCtx = setContext({
		open: [open ?? false, (value) => (open = value)],
		modal: [modal ?? false, (value) => (modal = value)],
		titleId: [generateId()],
		descriptionId: [generateId()],
		contentId: [generateId()],
		triggeredId: [null],
	});
	$: rootCtx.update((v) => ({
		...v,
		open: typeof open === 'boolean' ? open : v.open,
		modal: typeof modal === 'boolean' ? modal : v.modal,
	}));

	$: if (!$rootCtx.open && $rootCtx.triggeredId) {
		tick().then(() => {
			focus(`#${$rootCtx.triggeredId}`);
			$rootCtx.triggeredId = null;
		});
	}
</script>

<slot />
