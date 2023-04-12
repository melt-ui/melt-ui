<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';
	import type { BaseProps } from '$lib/types';

	export type PopperRootProps = BaseProps;

	type RootContext = {
		anchor: HTMLElement | null;
		arrow: HTMLElement | null;
	};

	const { getContext, setContext } = reactiveContext<RootContext>();
	export const getRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = PopperRootProps;

	setContext({
		anchor: [null],
		arrow: [null],
	});
</script>

<slot />
