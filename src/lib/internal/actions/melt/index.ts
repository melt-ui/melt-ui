/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, ActionReturn } from 'svelte/action';

type SomeBuilder<
	E = HTMLElement,
	P = never,
	A extends Record<string, any> = Record<never, any>
> = Record<string, any> & {
	action: Action<E, P, A>;
};

type GetActionAttributes<Builder> = Builder extends Record<string, any> & {
	action: Action<any, any, infer Attr>;
}
	? Attr
	: never;

/**
 * A special action for Melt UI's preprocessor `@melt-ui/pp`.
 *
 * @see https://www.melt-ui.com/docs/preprocessor
 *
 * @example
 * ```svelte
 * <script>
 * 	const { builder, melt } = createBuilder();
 * </script>
 *
 * <div use:melt={$builder} />
 * ```
 */
export function melt<
	Builder extends SomeBuilder,
	Element extends HTMLElement,
	Attributes extends GetActionAttributes<Builder>
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
>(node: Element, params: Builder): ActionReturn<Builder, Attributes> {
	return {};
}
