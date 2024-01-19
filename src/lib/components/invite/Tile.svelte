<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		triggerToastMessage,
		type ApiInvite,
		type Invite,
		triggerToastError,
		type Meta
	} from '$lib';
	import { afterUpdate } from 'svelte';
	import MenuIcon from '../icons/MenuIcon.svelte';
	import CloseIcon from '../icons/CloseIcon.svelte';
	import type { ActionResult } from '@sveltejs/kit';

	export let invite: Invite | ApiInvite;
	export let showTextOnDialog: (type: 'confirm' | 'remember', inviteId: number) => void;
	export let canRemove = false;

	let isOpen = false;
	let menuOptions: HTMLElement;
	let updateFormRef: HTMLFormElement;
	let inviteFormRef: HTMLFormElement;

	if ('person_id' in invite) {
		invite = {
			...invite,
			date: new Date(invite.date)
		};
	}

	const displayInvite = invite;
	const toggle = () => (isOpen = !isOpen);

	const tileMeta = (): Meta => {
		const meta = { color: '', status: '' };

		if (invite.accepted && invite.remembered) {
			meta['color'] = 'bg-green-500';
			meta['status'] = 'relembrado';

			return meta;
		}

		if (invite.accepted) {
			meta['color'] = 'bg-green-500/20';
			meta['status'] = 'aceito';

			return meta;
		}

		meta['color'] = 'bg-yellow-300/20';
		meta['status'] = 'pendente';

		return meta;
	};

	let meta = tileMeta();

	$: invite, meta;

	const triggerInviteMessage = () => {
		close();
		showTextOnDialog('confirm', invite.id);
	};

	const triggerRememberMessage = () => {
		close();
		showTextOnDialog('remember', invite.id);
	};

	const triggerConfirmForm = (event: MouseEvent) => {
		event.preventDefault();
		const canProceed = confirm('Deseja confirmar o convite?');
		if (!canProceed) {
			return;
		}

		inviteFormRef.requestSubmit();
		close();
	};

	const triggerUpdateForm = (event: MouseEvent) => {
		event.preventDefault();
		const canProceed = confirm('Foi relembrado?');
		if (!canProceed) return;

		updateFormRef.requestSubmit();
		close();
	};

	const inviteAction = () => {
		return async ({ result }: { result: ActionResult }) => {
			if (result.type === 'success') {
				triggerToastMessage('Convite aceito');
				invite.accepted = true;
				meta = tileMeta();
				return;
			}

			triggerToastError('Ocorreu um erro ao aceitar o convite');
		};
	};

	const rememberAction = () => {
		return async ({ result }: { result: ActionResult }) => {
			if (result.type === 'success') {
				triggerToastMessage('Convite relembrado');
				invite.remembered = true;
				meta = tileMeta();
				return;
			}

			triggerToastError('Ocorreu um erro ao relembrar o convite');
		};
	};

	const close = () => {
		isOpen = false;
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (isOpen && menuOptions && !menuOptions.contains(event.target as Node)) {
			close();
		}
	};

	afterUpdate(() => {
		document.addEventListener('click', handleClickOutside);
	});
</script>

<div bind:this={menuOptions} class="my-2 rounded border px-2 py-1 {meta.color}">
	<div class="flex justify-between">
		<div>
			<span class="block font-bold">{invite.person.name}</span>
			<small class="block">{invite.theme}</small>
			<small class="block">{displayInvite.date.toLocaleDateString('pt-BR')} / {invite.time}</small>
			<small class="font-bold">{meta.status}</small>
		</div>
		<span class="self-center" class:hidden={invite.remembered && invite.accepted && !canRemove}>
			<button on:click={toggle}>
				<i class:hidden={!isOpen}><CloseIcon size={3} /></i>
				<i class:hidden={isOpen}><MenuIcon size={3} /></i>
			</button>
		</span>
	</div>
	<div
		class=" flex transform flex-col transition-transform duration-500 md:absolute md:right-[1%] md:-mt-[1%] md:w-40 md:rounded md:bg-slate-300 md:p-1"
		class:hidden={!isOpen}
	>
		{#if !invite.remembered}
			<a
				href="/invite/{invite.id}"
				class="mb-1 w-full rounded border border-slate-400 bg-yellow-200 p-1 text-sm">Editar</a
			>
		{/if}
		{#if !invite.accepted}
			<button
				on:click={triggerInviteMessage}
				class="mb-1 w-full rounded border border-slate-400 bg-blue-200 p-1 text-start text-sm"
				>Convidar</button
			>
			<form
				bind:this={inviteFormRef}
				action="/invite?/accept"
				method="POST"
				use:enhance={inviteAction}
			>
				<input type="hidden" name="id" value={invite.id} />
				<button
					on:click={triggerConfirmForm}
					class="mb-1 w-full rounded border border-slate-400 bg-green-200 p-1 text-start text-sm"
					>Confirmar</button
				>
			</form>
		{/if}
		{#if !invite.remembered && invite.accepted}
			<button
				on:click={triggerRememberMessage}
				class="mb-1 w-full rounded border border-slate-400 bg-blue-200 p-1 text-start text-sm"
				>Lembrar</button
			>
			<form
				bind:this={updateFormRef}
				method="POST"
				use:enhance={rememberAction}
				action="/invite?/remember"
			>
				<input type="hidden" name="id" value={invite.id} />
				<button
					on:click={triggerUpdateForm}
					class="mb-1 w-full rounded border border-slate-400 bg-green-200 p-1 text-start text-sm"
					>Relembrar</button
				>
			</form>
		{/if}
		{#if canRemove}
			<button class="w-full rounded border border-slate-400 bg-red-200 p-1 text-start text-sm"
				>Remover</button
			>
		{/if}
	</div>
</div>
