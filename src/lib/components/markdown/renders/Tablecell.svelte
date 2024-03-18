<script lang="ts">
	export let header: boolean = false;
	export let align: 'left' | 'center' | 'right' | 'justify' | 'char' | null = 'right';
</script>

{#if header}
	<th class="flex justify-start border pl-2" {align}><slot /></th>
{:else}
	<td class="flex justify-start border pl-2" {align}><slot /></td>
{/if}
