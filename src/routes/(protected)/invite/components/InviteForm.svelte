<script lang="ts">
	import type { Invite, Person, TypeAheadOption } from '$lib';
	import { DatePicker } from 'date-picker-svelte';
	import TypeAhead from './TypeAhead.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from '../$types';
	import type { ActionData as UpdateActionData } from '../[id]/$types';
	import { goto } from '$app/navigation';

	export let people: Person[];
	export let form: ActionData | UpdateActionData;
	export let invite: Invite | null = null;

	const isUpdate = invite !== null;
	const action = isUpdate ? 'updateInvite' : 'createInvite';
	const buttonLabel = isUpdate ? 'Atualizar convite' : 'Criar convite';

	// logic
	const maxDate = new Date(new Date().getFullYear() + 10, 0, 1);
	let speaker: TypeAheadOption | null = null;
	if (!isUpdate) {
		const personId = form?.values?.personId;
		speaker = personId ? (people.find((p) => p.id === Number(personId)) as TypeAheadOption) : null;
	}
	let date = new Date(form?.values?.date ?? invite?.date ?? new Date()),
		showDatePicker = false,
		theme = form?.values?.theme ?? invite?.theme ?? '',
		time = form?.values?.time ?? invite?.time.toString() ?? '5',
		references = form?.values?.references ?? invite?.references ?? '',
		datePickerRef: HTMLDivElement | null = null;

	// state
	$: speaker, showDatePicker;
	$: if (form?.success || form?.updateSuccess) {
		goto('/invites');
	}
</script>

<form id="create-invite" action={`?/${action}`} method="POST" use:enhance>
	{#if form?.reqFail}
		<div class="text-4xl">Erro ao criar convite</div>
	{/if}
	<div class="flex justify-center">
		<div class="w-full p-4 bg-gray-100 rounded-lg">
			<div class="flex py-2 justify-between">
				<div class="text-2xl">Criar novo convite</div>
			</div>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="name"> Nome: </label>
				{#if isUpdate}
					<p>{invite?.person.name}</p>
				{:else}
					<TypeAhead
						options={people}
						on:speakerChange={(s) => {
							speaker = s.detail.speaker;
						}}
					/>
					{#if form?.noSpeaker}
						<p class="text-red-500">Selecione um orador</p>
					{/if}
					<input type="hidden" name="person_id" value={speaker?.id ?? ''} />
				{/if}
			</div>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="theme"> Tema: </label>
				<input
					class="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					id="theme"
					name="theme"
					type="text"
					placeholder="Tema do discurso"
					bind:value={theme}
					required
				/>
			</div>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="time"> Tempo: </label>
				<select
					id="time"
					name="time"
					class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					bind:value={time}
					required
				>
					<option value="5" selected={time.toString() === '5'}>5</option>
					<option value="10" selected={time.toString() === '10'}>10</option>
					<option value="15" selected={time.toString() === '15'}>15</option>
				</select>
			</div>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="date"> Data: </label>
				<div
					on:click={() => (showDatePicker = !showDatePicker)}
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							showDatePicker = !showDatePicker;
						}
					}}
					role="button"
					tabindex="0"
					class="block w-full bg-white p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				>
					{date.toLocaleDateString('pt-BR')}
				</div>
				<div bind:this={datePickerRef} class="absolute z-10 {showDatePicker ? 'block' : 'hidden'}">
					<DatePicker on:select={() => (showDatePicker = false)} bind:value={date} max={maxDate} />
				</div>
				{#if form?.noDate}
					<p class="text-red-500">Selecione uma data</p>
				{/if}
				<input type="hidden" name="date" bind:value={date} />
			</div>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="references">
					Referencias:
				</label>
				<textarea
					name="references"
					class="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					rows="5"
					id="references"
					placeholder="Referencias de discursos ou escrituras"
					required
					bind:value={references}
				></textarea>
			</div>
			<div class="flex justify-end">
				<button
					type="submit"
					class="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>{buttonLabel}</button
				>
			</div>
		</div>
	</div>
</form>
