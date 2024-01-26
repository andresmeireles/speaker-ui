// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		user: User;
		token: string;
	}

	interface Config {
		template: string;
	}
}

type HTTPClient = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
