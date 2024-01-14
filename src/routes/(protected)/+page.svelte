<script lang="ts">
	// TODO: fazer todos os botoes funcionarem
	import type { PageData } from './$types';
	import Tile from '$lib/components/invite/Tile.svelte';
	import InviteMessage from '$lib/components/invite/InviteMessage.svelte';
	import { PROTECTED_API_URLS } from '$lib';

	export let data: PageData;

	let today = new Date();
	let message = '';
	let showModal = false;

	const dateFormatter = (date: Date): string => {
		const dd = String(date.getDate()).padStart(2, '0');
		const mm = String(date.getMonth() + 1).padStart(2, '0');
		const yyyy = date.getFullYear();
		return `${dd}/${mm}/${yyyy}`;
	};

	const jumpToSunday = (date: Date): Date => {
		if (date.getDay() === 0) {
			return date;
		}
		date.setDate(date.getDate() + 1);
		return jumpToSunday(date);
	};

	if (today.getDay() === 0) {
		today.setDate(today.getDate() + 7);
	}

	if (today.getDay() !== 0) {
		today = jumpToSunday(today);
	}

	const displayDate = dateFormatter(today);
	const show =
		data.invites?.filter(
			(i) =>
				i.date.getDate() === today.getDate() &&
				i.date.getMonth() === today.getMonth() &&
				i.date.getFullYear() === today.getFullYear()
		) ?? [];
	const nextWeek = new Date(today.setDate(today.getDate() + 7));
	const displayDateNextWeek = dateFormatter(nextWeek);
	const showOnNextWeek =
		data.invites?.filter(
			(i) =>
				i.date.getDate() === nextWeek.getDate() &&
				i.date.getMonth() === nextWeek.getMonth() &&
				i.date.getFullYear() === nextWeek.getFullYear()
		) ?? [];

	const triggerMessage = async (type: 'confirm' | 'remember', inviteId: number) => {
		const req = await fetch(`${PROTECTED_API_URLS.INVITES}/message/${inviteId}`, {
			credentials: 'include',
			headers: {
				Authorization: `Bearer ${data.token}`
			}
		});

		if (!req.ok) {
			return;
		}

		const res = await req.json();
		const msg = type === 'confirm' ? res.invite : res.remember;
		message = msg;

		showModal = true;
	};

	$: message, showModal;
</script>

<InviteMessage bind:openDialog={showModal} {message} />

<div>
	<div class="flex flex-col py-6">
		<h1 class="text-3xl">Convites do domingo dia {displayDate}</h1>
		<div class="mt-8 flex-col justify-start">
			{#each show as i}
				<Tile invite={i} showTextOnDialog={triggerMessage} />
			{/each}
		</div>
	</div>
	<div class="mt-8 flex flex-col py-6">
		<h1 class="text-3xl">Convites do proximo domingo dia {displayDateNextWeek}</h1>
		<div class="mt-8 flex-col justify-start">
			{#each showOnNextWeek as i}
				<Tile invite={i} showTextOnDialog={triggerMessage} />
			{/each}
		</div>
	</div>
</div>
