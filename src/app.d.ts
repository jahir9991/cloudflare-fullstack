// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			DB: DrizzleD1Database
			KV: KVNamespace
		}
		// interface PageData {}
		interface Platform {
			env?: {
				DB: D1Database;
				KV: KVNamespace
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}

}

export { };
