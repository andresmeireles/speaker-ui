<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import MessageModal from './components/MessageModal.svelte';
	import { PROTECTED_API_URLS } from '$lib';
	import { triggerToastMessage } from '$lib/actions/toast';
	import InviteTile from './components/InviteTile.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { setContext } from 'svelte';

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

	const executeRemove = (event: Event, id: string) => {
		event.preventDefault();
		const canExecute = confirm('Deseja realmente remover o convite?');

		if (!canExecute) return;

		const form = document.getElementById(id) as HTMLFormElement;
		form.submit();
	};

	if (form?.inviteRemoved) {
		triggerToastMessage('Convite removido com sucesso!');
	}

	if (form?.inviteConfirmed) {
		triggerToastMessage(form?.requestResponseMessage);
	}

	if (form?.confirmReqFail) {
		triggerToastMessage('Erro ao confirmar convite');
	}

	if (form?.noId) {
		triggerToastMessage('ID inválido');
	}

	const showMessage = async (inviteId: number, messageType: 'confirm' | 'remember') => {
		const req = await fetch(`${PROTECTED_API_URLS.INVITES}/message/${inviteId}`, {
			credentials: 'include',
			headers: {
				Cookie: `session_id=${data.token}`,
				'Set-Cookie': `session_id=${data.token}`,
				Authorization: `Bearer ${data.token}`
			}
		});

		if (!req.ok) {
			triggerToastMessage('Erro ao obter mensagem');
			return;
		}

		const res = await req.json();
		message = messageType === 'confirm' ? res.invite : res.remember;
		showMessageModal = true;

		return {};
	};

	const handleMessageModalClose = () => {
		showMessageModal = false;
	};

	const activeInvite = writable(0);
	const modal = writable(false);
	const messageType: Writable<'confirm' | 'remember'> = writable('confirm');
	const accept = writable(false);
	const remember = writable(false);
	const isInvite = writable(true);
	setContext('activeInvite', activeInvite);
	setContext('modal', modal);
	setContext('messageType', messageType);
	setContext('accept', accept);
	setContext('remember', remember);
	setContext('isInvite', isInvite);

	$: showMessageModal, message, invites, showOutdatedInvites;
	$: if ($modal) {
		showMessage($activeInvite, $messageType);
		modal.set(false);
		activeInvite.set(0);
	}
</script>

<MessageModal
	on:close={handleMessageModalClose}
	dialog={messageDialogRef}
	{message}
	openDialog={showMessageModal}
	inviteId={$activeInvite}
/>

<div class="w-full">
	<div class="flex items-center justify-between py-6">
		<h1 class="text-3xl">Convites active</h1>
		<div>
			<a href="/invite" class="bg-green-600 text-gray-100 px-4 py-2 rounded">Novo</a>
		</div>
	</div>
	<div class="w-full">
		{#each invites ?? [] as invite}
			<InviteTile {invite} active={$activeInvite} />
		{/each}
	</div>
</div>
