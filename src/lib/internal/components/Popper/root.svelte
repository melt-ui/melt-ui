<script lang="ts" context="module">
	import { reactiveContext } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';

	export type PopperRootProps = BaseProps;

	type RootContext = {
		anchor: HTMLElement | null;
		arrow: HTMLElement | null;
	};

	const { getContext, setContext } = reactiveContext<RootContext>({
		anchor: null,
		arrow: null,
	});
	export const getRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = PopperRootProps;

	setContext();
</script>

<slot />
