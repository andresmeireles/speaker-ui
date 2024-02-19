<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { triggerToastError, triggerToastMessage } from '$lib/actions/toast';
	import SpeakerTile from './components/SpeakerTile.svelte';

	export let data: PageData;
	export let form: ActionData;

	const filterSpeakers = () => {
		if (!data?.speakers) {
			return [];
		}

		if (searchTerm.trim() === '') {
			return data?.speakers;
		}

		const chars = searchTerm.trim().length;
		if (chars < 2) {
			return data?.speakers;
		}

		return data?.speakers?.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
	};

	// internal variables
	let editorId: number = 0;
	let searchTerm = '';
	let displayedSpeakers = filterSpeakers();

	$: editorId, form;
	$: if (form?.removeFail) {
		triggerToastError('erro ao remover');
	}
	$: if (form?.successfullyRemoved) {
		triggerToastMessage('removido com sucesso');
	}
	$: searchTerm && (displayedSpeakers = filterSpeakers());
</script>

<div class="w-full py-4">
	<div class="mb-4 flex justify-between">
		<h1 class="text-3xl">Pessoas</h1>
		<a href="/speaker" class="rounded bg-green-600 px-4 py-2 text-gray-100">Novo</a>
	</div>

	<input
		type="text"
		class="mb-4 w-full rounded border-slate-300 py-3 text-2xl"
		placeholder="Pesquisar oradores"
		bind:value={searchTerm}
	/>

	<div class="mb-4">
		<span>exibindo {displayedSpeakers.length} de {data?.speakers?.length}</span>
	</div>

	<div class="w-full space-y-4">
		{#each displayedSpeakers as speaker}
			<SpeakerTile {speaker} />
		{/each}
	</div>
</div>
