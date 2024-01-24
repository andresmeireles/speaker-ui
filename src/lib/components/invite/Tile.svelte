<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		InviteStatus,
		triggerToastError,
		triggerToastMessage,
		type ApiInvite,
		type Invite
	} from '$lib';
	import type { ActionResult } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import CloseIcon from '../icons/CloseIcon.svelte';
	import MenuIcon from '../icons/MenuIcon.svelte';
	import { MetaDefinition } from './meta_definition';
	import WasDoneModal from './WasDoneModal.svelte';

	export let invite: Invite | ApiInvite;
	export let showTextOnDialog: (type: 'confirm' | 'remember', inviteId: number) => void;
	export let canRemove = false;

	let isOpen = false;
	let menuOptions: HTMLElement;
	let rememberFormRef: HTMLFormElement;
	let inviteFormRef: HTMLFormElement;
	let rejectFormRef: HTMLFormElement;
	let removeFormRef: HTMLFormElement;
	let meta = MetaDefinition.getMeta(invite.status);
	let canShow: boolean;
	let showWasDoneModal: boolean = false;

	if ('person_id' in invite) {
		invite = {
			...invite,
			date: new Date(invite.date)
		};
	}

	const displayInvite = invite;
	const toggle = () => (isOpen = !isOpen);

	$: invite, meta;
	$: canShow =
		!(
			invite.status in
			[InviteStatus.DONE, InviteStatus.NOT_DONE, InviteStatus.REJECTED, InviteStatus.REMEMBERED]
		) && !canRemove;

	const triggerInviteMessage = () => {
		close();
		showTextOnDialog('confirm', invite.id);
	};

	const triggerRememberMessage = () => {
		close();
		showTextOnDialog('remember', invite.id);
	};

	const canExecute = (event: MouseEvent, ref: HTMLFormElement, message: string) => {
		event.preventDefault();
		const canProceed = confirm(message);
		if (!canProceed) return;

		ref.requestSubmit();
		close();
	};

	const action = (props: {
		successMessage: string;
		status: InviteStatus;
		errorMessage?: string;
	}) => {
		const { successMessage, status, errorMessage } = props;
		return async ({ result }: { result: ActionResult }) => {
			if (result.type === 'success') {
				triggerToastMessage(successMessage);
				invite.status = status;
				meta = MetaDefinition.getMeta(invite.status);

				return;
			}

			triggerToastError(errorMessage ?? 'Ocorreu um erro na operação');
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

<WasDoneModal bind:show={showWasDoneModal} {invite} />

<div bind:this={menuOptions} class="my-2 rounded border px-2 py-1 {meta.color}">
	<div class="flex justify-between">
		<div>
			<span class="block font-bold">{invite.person.name}</span>
			<small class="block">{invite.theme}</small>
			<small class="block">{displayInvite.date.toLocaleDateString('pt-BR')} / {invite.time}</small>
			<small class="font-bold">{meta.label}</small>
		</div>
		<span class="self-center" class:hidden={canShow}>
			<button on:click={toggle}>
				<i class:hidden={!isOpen}><CloseIcon size={3} /></i>
				<i class:hidden={isOpen}><MenuIcon size={3} /></i>
			</button>
		</span>
	</div>
	<div
		class="flex transform flex-col transition-transform duration-500 md:absolute md:right-[1%] md:-mt-[1%] md:w-40 md:rounded md:bg-slate-300 md:p-1"
		class:hidden={!isOpen}
	>
		{#if invite.status === InviteStatus.WAIT_CONFIRMATION.valueOf()}
			<a
				href="/invite/{invite.id}"
				class="mb-1 w-full rounded border border-slate-400 bg-yellow-200 p-1 text-sm">Editar</a
			>
			<button
				on:click={triggerInviteMessage}
				class="mb-1 w-full rounded border border-slate-400 bg-blue-200 p-1 text-start text-sm"
				>Convidar</button
			>
			<form
				bind:this={inviteFormRef}
				action="/invite?/accept"
				method="POST"
				use:enhance={() =>
					action({ successMessage: 'Convite aceito', status: InviteStatus.CONFIRMED })}
			>
				<input type="hidden" name="id" value={invite.id} />
				<button
					on:click={(event) => canExecute(event, inviteFormRef, 'Aceitar convite?')}
					class="mb-1 w-full rounded border border-slate-400 bg-green-200 p-1 text-start text-sm"
					>Confirmar</button
				>
			</form>
			<form
				bind:this={rejectFormRef}
				action="/invite?/reject"
				method="POST"
				use:enhance={() =>
					action({ successMessage: 'Convite negado', status: InviteStatus.REJECTED })}
			>
				<input type="hidden" name="id" value={invite.id} />
				<button
					on:click={(event) => canExecute(event, rejectFormRef, 'Negar convite?')}
					class="mb-1 w-full rounded border border-slate-400 bg-orange-200 p-1 text-start text-sm"
					>Negar</button
				>
			</form>
		{/if}
		{#if [InviteStatus.CONFIRMED, InviteStatus.WAIT_REMEMBER].includes(invite.status)}
			<button
				on:click={triggerRememberMessage}
				class="mb-1 w-full rounded border border-slate-400 bg-blue-200 p-1 text-start text-sm"
				>Lembrar</button
			>
			<form
				bind:this={rememberFormRef}
				method="POST"
				use:enhance={() => action({ successMessage: 'Lembrado', status: InviteStatus.REMEMBERED })}
				action="/invite?/remember"
			>
				<input type="hidden" name="id" value={invite.id} />
				<button
					on:click={(event) => canExecute(event, rememberFormRef, 'Lembrar convite?')}
					class="mb-1 w-full rounded border border-slate-400 bg-green-200 p-1 text-start text-sm"
					>Relembrar</button
				>
			</form>
		{/if}
		{#if invite.status === InviteStatus.REMEMBERED}
			<button
				on:click={() => (showWasDoneModal = true)}
				class="mb-1 w-full rounded border border-slate-400 bg-green-200 p-1 text-start text-sm"
				>Finalizar</button
			>
		{/if}
		{#if canRemove}
			<form bind:this={removeFormRef} action="/invite?/remove" method="POST">
				<input type="hidden" name="id" value={invite.id} />
				<button
					on:click={(event) => canExecute(event, removeFormRef, 'Remover convite?')}
					class="w-full rounded border border-slate-400 bg-red-200 p-1 text-start text-sm"
					>Remover</button
				>
			</form>
		{/if}
	</div>
</div>
