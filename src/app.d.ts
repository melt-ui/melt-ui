// See https://kit.svelte.dev/docs/types#app
/// <reference types="@sveltejs/kit" />
/// <reference types="user-agent-data-types" />

import type { TextDirection } from '$lib/internal/types.js';

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
