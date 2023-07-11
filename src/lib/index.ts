export * from './builders';

import type { Action } from 'svelte/action';
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace svelteHTML {
		interface HTMLAttributes {
			/**
			 * TODO: Document me later
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
