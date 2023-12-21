<script lang="ts">
	let classes: string;
	export { classes as class };
</script>

<button class="{classes} py-2 px-4 rounded">
	<slot />
</button>
