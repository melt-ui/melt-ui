export * from './builders';

import type { Action } from 'svelte/action';
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace svelteHTML {
		interface HTMLAttributes<T> extends T {
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			melt?: Record<string, any> & { action: Action<any, any> };
		}
	}
}
