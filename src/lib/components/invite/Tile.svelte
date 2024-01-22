<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		InviteStatus,
		triggerToastError,
		triggerToastMessage,
		type ApiInvite,
		type Invite,
		type Meta
	} from '$lib';
	import type { ActionResult } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import CloseIcon from '../icons/CloseIcon.svelte';
	import MenuIcon from '../icons/MenuIcon.svelte';
	import { MetaDefinition } from './meta_definition';

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

	console.log(invite);

	const displayInvite = invite;
	const toggle = () => (isOpen = !isOpen);

	const tileMeta = (): Meta => {
		switch (invite.status) {
			case InviteStatus.CONFIRMED:
				return MetaDefinition.confirmed();
			case InviteStatus.REMEMBERED:
				return MetaDefinition.remembered();
			case InviteStatus.WAIT_REMEMBER:
				return MetaDefinition.waitingRemember();
			case InviteStatus.DONE:
				return MetaDefinition.done();
			case InviteStatus.NOT_DONE:
				return MetaDefinition.notDone();
			case InviteStatus.REJECTED:
				return MetaDefinition.rejected();
			default:
				return MetaDefinition.waitingConfirmation();
		}
	};

	let meta = tileMeta();
	let canShow: boolean;

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
				invite.status = InviteStatus.CONFIRMED;
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
				invite.status = InviteStatus.REMEMBERED;
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
		class=" flex transform flex-col transition-transform duration-500 md:absolute md:right-[1%] md:-mt-[1%] md:w-40 md:rounded md:bg-slate-300 md:p-1"
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
		{#if [InviteStatus.CONFIRMED, InviteStatus.WAIT_REMEMBER].includes(invite.status)}
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
			<form action="/invite?/remove" method="POST">
				<button class="w-full rounded border border-slate-400 bg-red-200 p-1 text-start text-sm"
					>Remover</button
				>
			</form>
		{/if}
	</div>
</div>
