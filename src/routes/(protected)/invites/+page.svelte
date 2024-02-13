<script lang="ts">
	import type { PageData } from './$types';
	import InviteMessage from '$lib/components/invite/InviteMessage.svelte';
	import { PROTECTED_API_URLS, type Invite } from '$lib';
	import { triggerToastMessage } from '$lib/actions/toast';
	import Tile from '$lib/components/invite/Tile.svelte';

	export let data: PageData;

	// show invites
	let showOutdatedInvites = false;
	const filterInvites = (invites: Invite[]) => {
		return invites.filter((invite) => {
			if (showOutdatedInvites) {
				return true;
			}

			// date minus one day
			const date = new Date();
			date.setDate(date.getDate() - 1);

			return date <= invite.date;
		});
	};

	let invites = filterInvites(data.invites ?? []);

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

	$: showMessageModal, message, invites;
	$: if (showOutdatedInvites) {
		invites = filterInvites(data.invites ?? []);
	}
	$: if (!showOutdatedInvites) {
		invites = filterInvites(data.invites ?? []);
	}
</script>

<InviteMessage bind:openDialog={showMessageModal} {message} />

<div class="w-full">
	<div class="flex items-center justify-between py-6">
		<h1 class="text-3xl">Convites active</h1>
		<div class="flex items-center gap-2">
			<div>
				<label>
					<input type="checkbox" bind:checked={showOutdatedInvites} /> Mostrar convites passados
				</label>
			</div>
			<a href="/invite" class="rounded bg-green-600 px-4 py-2 text-gray-100">Novo</a>
		</div>
	</div>
	<div class="w-full">
		{#each invites ?? [] as invite}
			<!-- <InviteTile {invite} active={$activeInvite} /> -->
			<Tile {invite} showTextOnDialog={showMessage} canRemove={true} />
		{/each}
	</div>
</div>
