<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';
	import { useActions } from '$lib/helpers/useActions';
	import type { BaseProps } from '$lib/types';

	export type ProgressRootProps = BaseProps<'progress'> & {
		/** The maximum progress value. */
		max?: number;
		/** The progress value. */
		value?: number | null;

		readonly 'data-state'?: 'complete' | 'indeterminate' | 'loading';
		readonly 'data-value'?: ProgressRootProps['value'];
		readonly 'data-max'?: ProgressRootProps['max'];
	};

	type ProgressContext = {
		max?: number;
		value?: number | null;
	};

	const { getContext, setContext } = reactiveContext<ProgressContext>();
	export const getRootContext = getContext;

	export function getState(
		value: ProgressRootProps['value'],
		max: ProgressRootProps['max']
	): ProgressRootProps['data-state'] {
		return value == null ? 'indeterminate' : value >= (max ?? 1) ? 'complete' : 'loading';
	}
</script>

<script lang="ts">
	type $$Props = ProgressRootProps;

	export let max: $$Props['max'] = 1;
	export let value: $$Props['value'] = null;

	const ctxStore = setContext({
		max: [max, (v) => (max = v)],
		value: [value, (v) => (value = v)],
	});
	$: ctxStore.set({ value, max });
</script>

<div
	role="progressbar"
	data-value={value}
	data-max={max}
	data-state={getState(value, max)}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-valuenow={value}
	aria-valuetext={`${(100 * (value ?? 0)) / (max ?? 1)}%`}
	{...$$restProps}
	use:useActions={$$restProps.use}
>
	<slot />
</div>
