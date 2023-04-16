<script lang="ts" context="module">
	import { reactiveContext } from '$lib/internal/helpers/reactiveContext';
	import type { BaseProps } from '$lib/internal/types';

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
