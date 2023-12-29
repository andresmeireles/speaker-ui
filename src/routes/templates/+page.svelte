<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import RoundButton from '$lib/components/buttons/RoundButton.svelte';

	export let data: PageData;
	export let form: ActionData;
</script>

{#if form?.success}
	Sucesso!
{/if}
<form method="POST">
	<label for="template">Template de convite</label>
	<p class="text-sm">
		Os simbolos <i>{`{name}`}</i> <i>{`{theme}`}</i> <i>{`{time}`}</i> <i>{`{date}`}</i> sempre serao
		subustituidos quando a mensagem for formada
	</p>
	{#if form?.tplError}
		<div class="text-4xl">Error on template</div>
	{/if}
	<textarea id="template" name="template" rows="8" class="form-textarea w-full rounded-xl"
		>{data?.template ?? form?.template ?? ''}</textarea
	>
	<div class="flex gap-2 justify-center">
		<RoundButton type="submit" class="w-full bg-blue-800 text-gray-100">Alterar</RoundButton>
	</div>
</form>
