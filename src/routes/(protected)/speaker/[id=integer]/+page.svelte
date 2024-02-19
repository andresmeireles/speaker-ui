<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { triggerToastError, triggerToastMessage } from '$lib';
	import RoundButton from '$lib/components/buttons/RoundButton.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const handler = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				goto('/speakers');
				triggerToastMessage('Orador atualizado!');
				return;
			}

			triggerToastError('falha ao atualizar');
			return;
		};
	};
</script>

<div class="p-3">
	<h1 class="text-4xl">Alterar dados de {data.speaker.name}</h1>
	<form action="?/updateUser" method="post" use:enhance={handler}>
		<div class="flex flex-col space-y-2 py-4">
			<input type="hidden" name="id" value={data.speaker.id} />
			<input
				type="text"
				name="speaker"
				placeholder="Orador"
				class="flex-3 mr-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
				value={data.speaker.name}
				autocomplete="off"
			/>
			<RoundButton type="submit" class="flex-2 bg-green-700 text-gray-100">Atualizar</RoundButton>
		</div>
	</form>
</div>
