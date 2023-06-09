// See https://kit.svelte.dev/docs/types#app
/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface Platform {
			env: {
				COUNTER: DurableObjectNamespace;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
