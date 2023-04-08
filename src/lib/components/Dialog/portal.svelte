<!-- React -->
<!-- const PORTAL_NAME = 'DialogPortal';

type PortalContextValue = { forceMount?: true };
const [PortalProvider, usePortalContext] = createDialogContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
});

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>;
interface DialogPortalProps extends Omit<PortalProps, 'asChild'> {
  children?: React.ReactNode;
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const DialogPortal: React.FC<DialogPortalProps> = (props: ScopedProps<DialogPortalProps>) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return (
    <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
      {React.Children.map(children, (child) => (
        <Presence present={forceMount || context.open}>
          <PortalPrimitive asChild container={container}>
            {child}
          </PortalPrimitive>
        </Presence>
      ))}
    </PortalProvider>
  );
};

DialogPortal.displayName = PORTAL_NAME; -->

<!-- Svelte -->
<script lang="ts" context="module">
	import { Portal } from '$lib/components/internal';
	import type { ComponentProps } from 'svelte';

	type PortalProps = ComponentProps<InstanceType<typeof Portal>>;
	export type DialogPortalProps = {
		container?: PortalProps['target'];
	};
</script>

<script lang="ts">
	import { getDialogRootContext } from './root.svelte';

	type $$Props = DialogPortalProps;

	export let container: $$Props['container'] = 'body';
	const rootCtx = getDialogRootContext();
</script>

{#if $rootCtx.open}
	<Portal target={container} {...$$restProps}>
		<slot />
	</Portal>
{/if}
