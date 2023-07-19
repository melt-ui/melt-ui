/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, ActionReturn } from 'svelte/action';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace svelteHTML {
		interface HTMLAttributes {
			/**
			 * A special attribute for Melt UI's preprocessor `@melt-ui/pp`.
			 *
			 * @see https://www.melt-ui.com/docs/preprocessor
			 *
			 * @example
			 * ```svelte
			 * <script>
			 * 	const { builder } = createBuilder();
			 * </script>
			 *
			 * <div melt={$builder} />
			 * ```
			 */
			melt?: Record<string, any> & { action: Action<any, any> };
		}
	}
}

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

export function melt<
	Builder extends SomeBuilder,
	Element extends HTMLElement,
	Attributes extends GetActionAttributes<Builder>
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
>(node: Element, params: Builder): ActionReturn<Builder, Attributes> {
	return {};
}
