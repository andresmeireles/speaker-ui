<script lang="ts">
	import type { Person, TypeAheadOption } from '$lib';
	import { DatePicker } from 'date-picker-svelte';
	import TypeAhead from './TypeAhead.svelte';
	import type { ActionData } from '../$types';
	import { enhance } from '$app/forms';

	export let dialog: HTMLDialogElement;
	export let people: Person[];
	export let form: ActionData;

	// internal variables
	let formRef: HTMLFormElement;

	// logic
	const maxDate = new Date(new Date().getFullYear() + 10, 0, 1);
	let speaker: TypeAheadOption | null = form?.values?.personId
			? (people.find((p) => p.id === Number(form?.values?.personId)) as TypeAheadOption)
			: null,
		date = new Date(form?.values?.date ?? new Date()),
		showDatePicker = false,
		theme = form?.values?.theme ?? '',
		time = form?.values?.time ?? 5,
		references = form?.values?.references ?? '',
		datePickerRef: HTMLDivElement | null = null;

	// state
	$: speaker, showDatePicker;
	$: if (form?.success) {
		dialog.close();
	}

	dialog.addEventListener('close', () => {
		date = new Date();
		speaker = null;
		formRef.reset();
	});

	const handleSpeakerChange = (event: CustomEvent<{ speaker: TypeAheadOption }>) => {
		speaker = event.detail.speaker;
	};
</script>

<form id="create-invite" action="?/createInvite" method="POST" use:enhance bind:this={formRef}>
	{#if form?.reqFail}
		<div class="text-4xl">Erro ao criar convite</div>
	{/if}
	<div class="flex justify-center">
		<div class="w-full p-4 bg-gray-100 rounded-lg">
			<div class="flex py-2 justify-between">
				<div class="text-2xl">Criar novo convite</div>
				<svg
					role="button"
					tabindex="0"
					on:click={() => dialog.close()}
					on:keydown={(e) => e.key === 'Escape' && dialog.close()}
					xmlns="http://www.w3.org/2000/svg"
					class="w-[3%] h-[3%] cursor-pointer"
					viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"
					/></svg
				>
			</div>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="name"> Nome: </label>
				<TypeAhead options={people} on:speakerChange={handleSpeakerChange} />
				{#if form?.noSpeaker}
					<p class="text-red-500">Selecione um orador</p>
				{/if}
				<input type="hidden" name="person_id" value={speaker?.id ?? ''} />
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
					<option value="5" selected>5</option>
					<option value="10">10</option>
					<option value="15">15</option>
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
					>Submit</button
				>
			</div>
		</div>
	</div>
</form>
