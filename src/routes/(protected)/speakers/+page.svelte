<script lang="ts">
	import RoundButton from '$lib/components/buttons/RoundButton.svelte';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { triggerToastError, triggerToastMessage } from '$lib/actions/toast';
	import SpeakerTile from './components/SpeakerTile.svelte';

	export let data: PageData;
	export let form: ActionData;

	// internal variables
	let editorId: number = 0;

	const close = () => {
		editorId = 0;
	};

	$: editorId, form;
	$: if (form?.updateFail) {
		triggerToastMessage('erro ao atualizar', {
			duration: 5000,
			theme: {
				'--toastBackground': '#48BB78',
				'--toastProgressBackground': '#2F855A'
			}
		});
	}
	$: if (form?.cannotUpdate) {
		triggerToastMessage('falha ao atualizar', {
			duration: 5000,
			theme: {
				'--toastBackground': '#48BB78',
				'--toastProgressBackground': '#2F855A'
			}
		});
	}
	$: if (form?.successfulyUpdated) {
		triggerToastMessage('atualizado com sucesso', {
			duration: 5000,
			theme: {
				'--toastBackground': '#48BB78',
				'--toastProgressBackground': '#2F855A'
			}
		});
	}
	$: if (form?.removeFail) {
		triggerToastError('erro ao remover');
	}
</script>

<div class="w-full">
	<div class="justify-between py-4">
		<h1 class="text-3xl">Pessoas</h1>
	</div>
	{#if form?.noSpeaker}
		<p>É necessário preencher um nome</p>
	{/if}
	{#if form?.success}
		<p>Sucesso!</p>
	{/if}
	<form class={editorId === 0 ? 'block' : 'hidden'} method="POST" action="?/writeUser">
		<div class="flex py-4">
			<input
				type="text"
				name="speaker"
				placeholder="Orador"
				class="mr-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
				value={form?.speaker ?? ''}
				autocomplete="off"
			/>
			<RoundButton type="submit" class="w-1/2 bg-blue-800 text-gray-100">Adicionar</RoundButton>
		</div>
	</form>
	<form class={editorId !== 0 ? 'block' : 'hidden'} action="?/updateUser" method="post" use:enhance>
		<div class="flex py-4">
			<input type="hidden" name="id" value={editorId} />
			<input
				type="text"
				name="speaker"
				placeholder="Orador"
				class="flex-3 mr-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
				value={data.speakers?.find((s) => s.id === editorId)?.name ?? ''}
				autocomplete="off"
			/>
			<RoundButton type="submit" class="flex-2 w-1/2 bg-green-700 text-gray-100"
				>Atualizar</RoundButton
			>
			<RoundButton click={close} class="ml-1 w-1/2 flex-1 bg-red-700 text-gray-100"
				>Fechar</RoundButton
			>
		</div>
	</form>
	<div class="w-full space-y-4">
		{#each data?.speakers ?? [] as speaker}
			<SpeakerTile {speaker} />
		{/each}
	</div>
</div>
