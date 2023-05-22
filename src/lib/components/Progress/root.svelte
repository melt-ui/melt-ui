<script lang="ts" context="module">
	import { reactiveContext, type Defaults } from '$lib/internal/helpers';

	import { useActions } from '$lib/internal/helpers/useActions';
	import type { BaseProps } from '$lib/internal/types';

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

	const defaults = {
		max: 1,
		value: null,
	} satisfies Defaults<ProgressContext>;
	const { getContext, setContext } = reactiveContext<ProgressContext>(defaults);
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

	export let max: $$Props['max'] = defaults.max;
	export let value: $$Props['value'] = defaults.value;

	const ctxStore = setContext({ value: (v) => (value = v), max: (m) => (max = m) });
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
