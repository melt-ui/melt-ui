<!-- React cmp -->
<!-- const TRIGGER_NAME = 'DialogTrigger';

type DialogTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface DialogTriggerProps extends PrimitiveButtonProps {}

const DialogTrigger = React.forwardRef<DialogTriggerElement, DialogTriggerProps>(
  (props: ScopedProps<DialogTriggerProps>, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return (
      <Primitive.button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        {...triggerProps}
        ref={composedTriggerRef}
        onClick={composeEventHandlers(props.onClick, context.onOpenToggle)}
      />
    );
  }
);

DialogTrigger.displayName = TRIGGER_NAME; -->

<!-- Svelte cmp -->
<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getDataState } from './helpers';
	import { getDialogRootContext } from './root.svelte';

	export type DialogTriggerProps = BaseProps<HTMLButtonElement>;
</script>

<script lang="ts">
	type $$Props = DialogTriggerProps;

	const rootCtx = getDialogRootContext();
</script>

<!-- TODO: include aria-controls -->
<button
	aria-haspopup="dialog"
	aria-expanded={$rootCtx.open}
	data-state={getDataState($rootCtx.open)}
	on:click={() => {
		$rootCtx.open = !$rootCtx.open;
	}}
	{...$$restProps}
>
	<slot />
</button>
