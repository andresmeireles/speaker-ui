<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import InviteMessage from '$lib/components/invite/InviteMessage.svelte';
	import { PROTECTED_API_URLS } from '$lib';
	import { triggerToastMessage } from '$lib/actions/toast';
	import Tile from '$lib/components/invite/Tile.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { setContext } from 'svelte';

	export let data: PageData;

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

	const showMessage = async (messageType: 'confirm' | 'remember', inviteId: number) => {
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

	$: showMessageModal, message, invites, showOutdatedInvites;
</script>

<InviteMessage bind:openDialog={showMessageModal} {message} />

<div class="w-full">
	<div class="flex items-center justify-between py-6">
		<h1 class="text-3xl">Convites active</h1>
		<div>
			<a href="/invite" class="rounded bg-green-600 px-4 py-2 text-gray-100">Novo</a>
		</div>
	</div>
	<div class="w-full">
		{#each invites ?? [] as invite}
			<!-- <InviteTile {invite} active={$activeInvite} /> -->
			<Tile {invite} showTextOnDialog={showMessage} httpClient={fetch} canRemove={true} />
		{/each}
	</div>
</div>
