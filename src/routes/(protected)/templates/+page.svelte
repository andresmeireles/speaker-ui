<script lang="ts">
	import RoundButton from '$lib/components/buttons/RoundButton.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let rememberMessage = form?.values?.remember ?? data?.remember ?? '';
	let template = form?.values?.template ?? data?.template ?? '';
</script>

{#if form?.success}
	Sucesso!
{/if}
<form method="POST">
	<label for="remember">Mensagem de lembrete</label>
	<p class="text-sm mb-4">
		Os símbolos <i>{`{{name}}`}</i> <i>{`{{theme}}`}</i> <i>{`{{time}}`}</i> <i>{`{{date}}`}</i>
		<i>{`{{references}}`}</i> sempre serão substituídos quando a mensagem for formada
	</p>
	<textarea
		name="remember"
		id="remember"
		rows="8"
		class="form-textarea w-full rounded-xl mb-8"
		bind:value={rememberMessage}
	></textarea>
	<label for="template">Template de convite</label>
	<p class="text-sm mb-4">
		Os símbolos <i>{`{{name}}`}</i> <i>{`{{theme}}`}</i> <i>{`{{time}}`}</i> <i>{`{{date}}`}</i>
		<i>{`{{references}}`}</i> sempre serão substituídos quando a mensagem for formada
	</p>
	{#if form?.tplError}
		<div class="text-4xl">Error on template</div>
	{/if}
	<textarea
		id="template"
		name="template"
		rows="8"
		class="form-textarea w-full rounded-xl mb-8"
		bind:value={template}
	></textarea>
	<div class="flex gap-2 justify-center">
		<RoundButton type="submit" class="w-full bg-blue-800 text-gray-100">Alterar</RoundButton>
	</div>
</form>
