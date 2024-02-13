<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { Invite, Person, TypeAheadOption } from '$lib';
	import { triggerToastError, triggerToastMessage } from '$lib/actions/toast';
	import { DatePicker } from 'date-picker-svelte';
	import type { ActionData } from '../$types';
	import type { ActionData as UpdateActionData } from '../[id=integer]/$types';
	import TypeAhead from './TypeAhead.svelte';
	import { onMount } from 'svelte';

	export let people: Person[];
	export let form: ActionData | UpdateActionData;
	export let invite: Invite | null;
	export let referer = '';

	const isUpdate = invite?.id !== 0;
	const action = isUpdate ? 'updateInvite' : 'createInvite';
	const buttonLabel = isUpdate ? 'Atualizar convite' : 'Criar convite';
	const maxDate = new Date(new Date().getFullYear() + 10, 0, 1);

	let personId = form?.values?.person_id ?? invite?.person?.id ?? 0;
	let themeRef: HTMLInputElement;
	let speaker: TypeAheadOption | null = personId
		? (people.find((p) => p.id === Number(personId)) as TypeAheadOption)
		: null;
	let date = new Date(form?.values?.date ?? invite?.date ?? new Date()),
		showDatePicker = false,
		theme = form?.values?.theme ?? invite?.theme ?? '',
		time = form?.values?.time ?? invite?.time.toString() ?? '5',
		references = form?.values?.references ?? invite?.references ?? '',
		datePickerRef: HTMLDivElement | null = null;

	// state
	$: speaker, showDatePicker;
	$: if ((form as ActionData)?.success) {
		goto('/invites');
	}
	$: if (form?.reqFail) {
		triggerToastMessage('Erro ao criar convite');
	}
	$: if ((form as ActionData)?.reqFail || (form as UpdateActionData)?.reqFail) {
		triggerToastError('falha no convite');
	}

	onMount(() => {
		if (personId !== null && personId !== 0) {
			themeRef.focus();
		}
	});

	const enhanceHandler = ({ formElement, formData, action, cancel, submitter }) => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				goto(result.location);
				return;
			}

			await applyAction(result);
		};
	};
</script>

<div class="w-full">
	<form id="create-invite" action={`?/${action}`} method="POST" use:enhance={enhanceHandler}>
		<input type="hidden" name="referer" value={referer} />
		<div class="flex justify-center">
			<div class="w-full rounded-lg bg-gray-100 p-4">
				<div class="flex justify-between py-2">
					<div class="text-2xl">Criar novo convite</div>
				</div>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-bold text-gray-700" for="name"> Nome: </label>
					{#if isUpdate}
						<p>{invite?.person.name}</p>
					{:else}
						<TypeAhead
							bind:personId
							selectedOption={speaker}
							options={people}
							on:speakerChange={(s) => {
								speaker = s.detail.speaker;
							}}
						/>
						{#if form?.noSpeaker}
							<p class="text-red-500">Selecione um orador</p>
						{/if}
						<input type="hidden" name="person_id" bind:value={personId} />
					{/if}
				</div>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-bold text-gray-700" for="theme"> Tema: </label>
					<input
						bind:this={themeRef}
						class="focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						id="theme"
						name="theme"
						type="text"
						placeholder="Tema do discurso"
						bind:value={theme}
						required
					/>
				</div>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-bold text-gray-700" for="time"> Tempo: </label>
					<select
						id="time"
						name="time"
						class="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
						bind:value={time}
						required
					>
						<option value="5" selected={time.toString() === '5'}>5</option>
						<option value="10" selected={time.toString() === '10'}>10</option>
						<option value="15" selected={time.toString() === '15'}>15</option>
					</select>
				</div>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-bold text-gray-700" for="date"> Data: </label>
					<div
						on:click={() => (showDatePicker = !showDatePicker)}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								showDatePicker = !showDatePicker;
							}
						}}
						role="button"
						tabindex="0"
						class="block w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
					>
						{date.toLocaleDateString('pt-BR')}
					</div>
					<div
						bind:this={datePickerRef}
						class="absolute z-10 {showDatePicker ? 'block' : 'hidden'}"
					>
						<DatePicker
							on:select={() => (showDatePicker = false)}
							bind:value={date}
							max={maxDate}
						/>
					</div>
					{#if form?.noDate}
						<p class="text-red-500">Selecione uma data</p>
					{/if}
					<input type="hidden" name="date" bind:value={date} />
				</div>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-bold text-gray-700" for="references">
						Referencias:
					</label>
					<textarea
						name="references"
						class="focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
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
						class="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
						>{buttonLabel}</button
					>
				</div>
			</div>
		</div>
	</form>
</div>
