<script lang="ts" context="module">
	import { focus } from '$lib/internal/helpers';
	import { reactiveContext } from '$lib/internal/helpers';
	import { generateId } from '$lib/internal/helpers';
	import { tick } from 'svelte';

	export type DialogRootProps = {
		open?: boolean;
		modal?: boolean;
		openAutoFocus?: boolean;
		closeAutoFocus?: boolean;
	};

	type DialogRootContext = {
		open: boolean;
		modal: boolean;
		readonly titleId: string;
		readonly descriptionId: string;
		readonly contentId: string;
		triggeredId: string | null;
		openAutoFocus?: boolean;
	};

	const { getContext, setContext } = reactiveContext<DialogRootContext>();
	export const getDialogRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = DialogRootProps;

	export let open: $$Props['open'] = false;
	export let modal: $$Props['modal'] = false;
	export let openAutoFocus: $$Props['openAutoFocus'] = true;
	export let closeAutoFocus: $$Props['closeAutoFocus'] = true;

	const rootCtx = setContext({
		open: [open ?? false, (value) => (open = value)],
		modal: [modal ?? false, (value) => (modal = value)],
		titleId: [generateId()],
		descriptionId: [generateId()],
		contentId: [generateId()],
		triggeredId: [null],
		openAutoFocus: [openAutoFocus, (value) => (openAutoFocus = value)],
	});
	$: rootCtx.update((v) => ({
		...v,
		open: typeof open === 'boolean' ? open : v.open,
		modal: typeof modal === 'boolean' ? modal : v.modal,
		openAutoFocus,
	}));

	$: if (!$rootCtx.open && $rootCtx.triggeredId && closeAutoFocus) {
		tick().then(() => {
			focus(`#${$rootCtx.triggeredId}`);
			$rootCtx.triggeredId = null;
		});
	}
</script>

<slot />
