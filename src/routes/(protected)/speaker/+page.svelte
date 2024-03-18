<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { triggerToastMessage } from '$lib';
	import RoundButton from '$lib/components/buttons/RoundButton.svelte';
	import type { ActionData } from './$types';
	import SpeakerInputs from './components/SpeakerInputs.svelte';

	export let form: ActionData;

	let errorMessage = '';
	let hasError = false;

	const handler = () => {
		hasError = false;

		return async ({ result }) => {
			hasError = false;

			if (result.type === 'success') {
				goto('/speakers');
				triggerToastMessage('Orador adicionado!');

				return;
			}

			if (result.type === 'failure') {
				const data = result.data;

				if (data.noSpeaker) {
					hasError = true;
					errorMessage = 'Por favor, insira o nome do orador';

					return;
				}

				hasError = true;
				errorMessage = 'Falha ao adicionar o orador';

				return;
			}
		};
	};

	$: errorMessage, hasError;
</script>

<div class="p-3">
	<h1 class="text-4xl">Novo Orador</h1>
	<div class="mt-4 w-full">
		<form method="POST" action="?/writeUser" use:enhance={handler}>
			<div class="flex flex-col space-y-2 py-4">
				<SpeakerInputs {form} {hasError} {errorMessage} />
				<RoundButton type="submit" class="w-full bg-blue-800 text-gray-100">Adicionar</RoundButton>
			</div>
		</form>
	</div>
</div>
