<script lang="ts">
	export let content: string;
	export let row: string;
	export let text: any;

	console.log('bostil!', content, row, text);
</script>

<tr class="bg-red-200">{content}</tr>
