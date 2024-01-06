<script lang="ts">
	import RoundButton from '$lib/components/buttons/RoundButton.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	// internal variables
	let editorId: number = 0;
	let options = {}

	const close = () => {
		editorId = 0;
	};

	$: editorId, form;
	$: if (form?.updateFail) {
		toast.push("erro ao atualizar");
		options = {
			duration: 5000,
			theme: {
				'--toastBackground': '#48BB78',
				'--toastProgressBackground': '#2F855A'
			}	
		}
	}
	$: if (form?.cannotUpdate) {
		toast.push("erro ao enviar atualizacao");
		options = {
			duration: 5000,
			theme: {
				'--toastBackground': '#48BB78',
				'--toastProgressBackground': '#2F855A'
			}	
		}
	}
	$: if (form?.successfulyUpdated) {
		toast.push("atualizado com sucesso");
		options = {
			duration: 5000,
			theme: {
				'--toastBackground': '#48BB78',
				'--toastProgressBackground': '#2F855A'
			}	
		}
		
	}
</script>

<SvelteToast {options} />
<div>
	<div class="flex justify-between py-4">
		<h1 class="text-3xl">Pessoas</h1>
	</div>
	{#if form?.noSpeaker}
		<p>É necessario preencher um nome</p>
	{/if}
	{#if form?.success}
		<p>Sucesso!</p>
	{/if}
	<form class={editorId === 0 ? 'block' : 'hidden'} method="POST" action="?/writeUser">
		<div class="py-4 flex">
			<input
				type="text"
				name="speaker"
				placeholder="Orador"
				class="w-full p-2 mr-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				value={form?.speaker ?? ''}
				autocomplete="off"
			/>
			<RoundButton type="submit" class="w-1/2 bg-blue-800 text-gray-100">Adicionar</RoundButton>
		</div>
	</form>
	<form class={editorId !== 0 ? 'block' : 'hidden'} action="?/updateUser" method="post" use:enhance>
		<div class="py-4 flex">
			<input type="hidden" name="id" value={editorId} />
			<input
				type="text"
				name="speaker"
				placeholder="Orador"
				class="w-full p-2 flex-3 mr-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				value={data.speakers?.find((s) => s.id === editorId)?.name ?? ''}
				autocomplete="off"
			/>
			<RoundButton type="submit" class="w-1/2 flex-2 bg-green-700 text-gray-100"
				>Atualizar</RoundButton
			>
			<RoundButton click={close} class="w-1/2 flex-1 ml-1 bg-red-700 text-gray-100"
				>Fechar</RoundButton
			>
		</div>
	</form>
	<div>
		<table class="w-full border-collapse table-auto">
			<thead class="bg-slate-200">
				<tr>
					<th class="border border-slate-300 py-3">Nome</th>
					<th class="border border-slate-300 py-3">Acao</th>
				</tr>
			</thead>
			<tbody class="bg-slate-100">
				{#if form?.removeFail}
					<p>Deu ruim demais</p>
				{/if}
				{#each data?.speakers ?? [] as speaker}
					<tr>
						<td class="border border-slate-200 text-center py-2">{speaker.name}</td>
						<td class="flex justify-center space-x-2 border border-slate-200 text-center py-2">
							<form method="POST" action="?/removeUser">
								<input type="hidden" name="speaker" value={speaker.id} />
								<button class="bg-red-600 p-2 rounded-md text-white">Remover</button>
							</form>
							<button
								on:click={() => (editorId = speaker.id)}
								class="bg-green-600 p-2 rounded-md text-white">Editar</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
