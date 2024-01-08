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
