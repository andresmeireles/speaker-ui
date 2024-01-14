<script lang="ts">
	import type { Invite } from '$lib';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let invite: Invite;
	export let active: number;

	const activeInvite = getContext<Writable<number>>('activeInvite');
	const modal = getContext<Writable<boolean>>('modal');
	const messageType = getContext<Writable<'confirm' | 'remember'>>('messageType');
	const accept = getContext<Writable<boolean>>('accept');
	const remember = getContext<Writable<boolean>>('remember');
	const isInvite = getContext<Writable<boolean>>('isInvite');
	const colorTile = () => {
		if (invite.accepted && invite.remembered) {
			return 'bg-green-500';
		}
		if (invite.remembered) {
			return 'bg-green-500/20';
		}
		if (invite.accepted) {
			return 'bg-blue-300/20';
		}

		return 'bg-yellow-300/20';
	};
	const status = () => {
		if (invite.accepted && invite.remembered) {
			return 'Aceito e relembrado';
		}
		if (invite.remembered) {
			return 'Relembrado';
		}
		if (invite.accepted) {
			return 'Aceito';
		}

		return 'aguardando aceite';
	};

	const toggle = (id: number) => {
		isInvite.set(invite.accepted && !invite.remembered);
		if ($activeInvite === id) {
			activeInvite.set(0);
			return;
		}
		activeInvite.set(id);
	};
	const triggerInvite = () => {
		messageType.set('confirm');
		modal.set(true);
	};
	const triggerRemember = () => {
		messageType.set('remember');
		modal.set(true);
	};
	const triggerAction = () => {
		if (invite.accepted) {
			remember.set(true);

			return;
		}

		accept.set(true);
	};

	let dialogRef: HTMLDialogElement;
	let isActive = invite.id === active;

	$: dialogRef, dialogRef, isActive;
	$: isActive = invite.id === $activeInvite;
</script>

<div class="py-1 px-2 my-2 border rounded {colorTile()}">
	<div class="flex justify-between">
		<div>
			<span class="block font-bold">{invite.person.name}</span>
			<small class="block">{invite.theme}</small>
			<small class="block">{invite.date.toLocaleDateString('pt-BR')} / {invite.time}</small>
			<small class="font-bold">{status()}</small>
		</div>
		<span class="self-center">
			<button on:click={() => toggle(invite.id)} class="md:hidden border border-blue-600 rounded">
				<MenuIcon size={2} />
			</button>
		</span>
	</div>
	<div class="flex flex-col transform transition-transform duration-500" class:hidden={!isActive}>
		{#if !invite.remembered}
			<a
				href="/invite/{invite.id}"
				class="text-sm w-full rounded bg-yellow-200 p-1 border border-slate-400 mb-1">Editar</a
			>
		{/if}
		{#if !invite.accepted}
			<button
				on:click={triggerInvite}
				class="text-sm text-start rounded bg-blue-200 w-full p-1 border border-slate-400 mb-1"
				>Convidar</button
			>
			<button
				on:click={triggerAction}
				class="text-sm text-start rounded bg-green-200 w-full p-1 border border-slate-400"
				>Confirmar</button
			>
		{/if}
		{#if !invite.remembered && invite.accepted}
			<button
				on:click={triggerRemember}
				class="text-sm text-start rounded bg-blue-200 w-full p-1 border border-slate-400 mb-1"
				>Lembrar</button
			>
			<button
				on:click={triggerAction}
				class="text-sm text-start rounded bg-green-200 w-full p-1 border border-slate-400"
				>Confirmar</button
			>
		{/if}
	</div>
</div>
