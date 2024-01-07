<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import InviteForm from './components/InviteModal.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import MessageModal from './components/MessageModal.svelte';
	import { PROTECTED_API_URLS } from '$lib';

	export let data: PageData;
	export let form: ActionData;

	// show invites
	let showOutdatedInvites = false;
	let invites = data.invites?.filter((invite) => {
		// filter outdated invites
		if (showOutdatedInvites) {
			return invite;
		}

		return new Date() <= invite.date;
	});

	// message variables
	let showMessageModal = false;
	let message = '';
	let messageDialogRef: HTMLDialogElement;
	let inviteMessageId: number = 0;
	let isInvite = true;

	// invite variables
	let showModal = false;
	let dialog: HTMLDialogElement = {
		addEventListener: (a: string, b: () => void) => {}
	} as HTMLDialogElement;

	const executeRemove = (event: Event, id: string) => {
		event.preventDefault();
		const canExecute = confirm('Deseja realmente remover o convite?');

		if (!canExecute) return;

		const form = document.getElementById(id) as HTMLFormElement;
		form.submit();
	};

	const options = {
		duration: 5000,
		theme: {
			'--toastBackground': '#48BB78',
			'--toastProgressBackground': '#2F855A'
		}
	};

	if (form?.inviteRemoved) {
		toast.push('Convite removido com sucesso!');
	}

	if (form?.inviteConfirmed) {
		toast.push(form?.requestResponseMessage);
	}

	if (form?.confirmReqFail) {
		toast.push('Erro ao confirmar convite');
	}

	if (form?.noId) {
		toast.push('ID inválido');
	}

	const showMessage = async (
		event: MouseEvent,
		inviteId: number,
		messageType: 'confirm' | 'remember'
	) => {
		event.preventDefault();
		const req = await fetch(`${PROTECTED_API_URLS.INVITES}/message/${inviteId}`, {
			credentials: 'include'
		});

		if (!req.ok) {
			toast.push('Erro ao obter mensagem');
			return;
		}

		const res = await req.json();
		message = messageType === 'confirm' ? res.invite : res.remember;
		isInvite = messageType === 'confirm';
		showMessageModal = true;
		inviteMessageId = inviteId;

		return {};
	};

	const handleMessageModalClose = () => {
		showMessageModal = false;
	};

	$: if (dialog && showModal) dialog.showModal();
	$: showMessageModal, message, inviteMessageId, invites, showOutdatedInvites;
</script>

<SvelteToast {options} />

<dialog class="w-5/6 rounded-md" bind:this={dialog} on:close={() => (showModal = false)}>
	<InviteForm people={data?.speakers ?? []} {dialog} {form} />
</dialog>

<MessageModal
	on:close={handleMessageModalClose}
	dialog={messageDialogRef}
	{message}
	openDialog={showMessageModal}
	inviteId={inviteMessageId}
	{isInvite}
/>

<div>
	<div class="flex justify-between py-6">
		<h1 class="text-3xl">Convites</h1>
		<div>
			<button
				on:click={() => (showModal = true)}
				class="bg-green-600 text-gray-100 px-4 py-2 rounded">Novo</button
			>
		</div>
	</div>
	<div class="w-full">
		<table class="w-full border-collapse">
			<thead class="bg-slate-200">
				<tr>
					<th class="border border-r-slate-300 py-3">Nome</th>
					<th class="border border-r-slate-300 py-3">Tema</th>
					<th class="border border-r-slate-300 py-3">Dia/Tempo</th>
					<th class="border border-r-slate-300 py-3">Acao</th>
				</tr>
			</thead>
			<tbody class=" bg-slate-100">
				{#each invites ?? [] as invite}
					<tr>
						<td class="text-center border border-slate-200 p-3">{invite.person.name}</td>
						<td class="text-center border border-slate-200 p-3">{invite.theme}</td>
						<td class="text-center border border-slate-200 p-3"
							>{invite.date.toLocaleDateString('pt-BR')} - {invite.time} min</td
						>
						<td class="text-center border border-slate-200 p-3 flex gap-1 justify-center">
							{#if !invite.accepted}
								<button
									on:click={(event) => showMessage(event, invite.id, 'confirm')}
									class="rounded-sm bg-blue-600 py-1 px-4 text-white">Convidar</button
								>
							{:else}
								<button
									on:click={(event) => showMessage(event, invite.id, 'remember')}
									class="rounded-sm bg-green-600 py-1 px-4 text-white"
									>{invite.remembered ? 'Relembrado' : 'Relembrar'}</button
								>
							{/if}
							<button class="rounded-sm bg-green-600 py-1 px-4 text-white">Editar</button>
							<form id={`remove-${invite.id}`} method="post" action="?/removeInvite">
								<input type="hidden" name="id" value={invite.id} />
								<button
									on:click={(event) => executeRemove(event, `remove-${invite.id}`)}
									class="rounded-sm bg-red-600 py-1 px-4 text-white">Remover</button
								>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
