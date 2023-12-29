<script lang="ts">
	import RoundButton from '$lib/components/buttons/RoundButton.svelte';
	import type { Speaker } from '$lib/interfaces/speaker';

	let speaker = '';

	let speakers: Speaker[] = [
		{
			name: 'andre',
			id: 666666666666666
		}
	];

	const addSpeaker = () => {
		if (!speaker) {
			return;
		}

		const newSpeaker = {
			name: speaker,
			id: Math.ceil(Math.random() * 1000)
		};

		speakers = [...speakers, newSpeaker];

		speaker = '';
	};

	const removeSpeaker = (id: number) => {
		const authorize = confirm('Tem certeza que deseja remover este orador?');
		if (!authorize) {
			return;
		}

		speakers = [...speakers.filter((speaker) => speaker.id !== id)];
	};

	$: speakers, speaker;
</script>

<div>
	<div class="flex justify-between py-4">
		<h1 class="text-3xl">Pessoas</h1>
	</div>
	<div class="py-4 flex jus">
		<input
			type="text"
			on:input={(e) => (speaker = e.currentTarget.value)}
			placeholder="Orador"
			class="w-full p-2 mr-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
			value={speaker}
		/>
		<RoundButton click={addSpeaker} class="w-1/2 bg-blue-800 text-gray-100">Adicionar</RoundButton>
	</div>
	<div>
		<table class="w-full border-collapse table-auto">
			<thead class="bg-slate-200">
				<tr>
					<th class="border border-slate-300 py-3">Nome</th>
					<th class="border border-slate-300 py-3">Acao</th>
				</tr>
			</thead>
			<tbody class="bg-slate-100">
				{#each speakers as speaker}
					<tr>
						<td class="border border-slate-200 text-center py-2">{speaker.name}</td>
						<td class="flex justify-center space-x-2 border border-slate-200 text-center py-2">
							<button
								on:click={() => removeSpeaker(speaker.id)}
								class="bg-red-600 p-2 rounded-md text-white">Remover</button
							>
							<button class="bg-green-600 p-2 rounded-md text-white">Editar</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
