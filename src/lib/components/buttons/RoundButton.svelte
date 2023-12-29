<script lang="ts">
	import type { EventHandler } from 'svelte/elements';

	let classes: string;
	export { classes as class };
	let buttonType: 'button' | 'submit' | 'reset' = 'button';
	export { buttonType as type };

	export let click: EventHandler | undefined | null = null;
</script>

<button type={buttonType} on:click={click} class="{classes} py-2 px-4 rounded">
	<slot />
</button>
