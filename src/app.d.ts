// See https://kit.svelte.dev/docs/types#app
/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

import type { TextDirection } from '@melt-ui/svelte/internal/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	namespace Intl {
		interface Locale {
			textInfo?: {
				direction: TextDirection;
			};
		}
	}
}

export {};
