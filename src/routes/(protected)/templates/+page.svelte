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
	<label for="forms">Formulários cadastrados</label>
	<div class="mb-4 mt-2 flex flex-col">
		<a class="mb-2 w-1/2 rounded bg-blue-400 px-3 py-2 font-bold text-white" href="/templates/form"
			>adicionar novo formulário</a
		>
		<div>a</div>
	</div>
	<label for="remember">Mensagem de lembrete</label>
	<p class="mb-4 text-sm">
		Os símbolos <i>{`{{name}}`}</i> <i>{`{{theme}}`}</i> <i>{`{{time}}`}</i> <i>{`{{date}}`}</i>
		<i>{`{{references}}`}</i> sempre serão substituídos quando a mensagem for formada
	</p>
	<textarea
		name="remember"
		id="remember"
		rows="8"
		class="form-textarea mb-8 w-full rounded-xl"
		bind:value={rememberMessage}
	></textarea>
	<label for="template">Template de convite</label>
	<p class="mb-4 text-sm">
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
		class="form-textarea mb-8 w-full rounded-xl"
		bind:value={template}
	></textarea>
	<div class="flex justify-center gap-2">
		<RoundButton type="submit" class="w-full bg-blue-800 text-gray-100">Alterar</RoundButton>
	</div>
</form>
