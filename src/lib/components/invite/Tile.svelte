<script lang="ts">
	// TODO: when not is mobile make it appears a dropdown
	import type { ApiInvite, Invite } from '$lib';
	import { afterUpdate } from 'svelte';
	import MenuIcon from '../icons/MenuIcon.svelte';
	import CloseIcon from '../icons/CloseIcon.svelte';

	export let invite: Invite | ApiInvite;
	export let showTextOnDialog: (type: 'confirm' | 'remember', inviteId: number) => void;

	let isOpen = false;
	let menuOptions: HTMLElement;

	if ('person_id' in invite) {
		invite = {
			...invite,
			date: new Date(invite.date)
		};
	}
	const displayInvite = invite;

	interface Meta {
		color: string;
		status: string;
	}

	const toggle = () => {
		isOpen = !isOpen;
	};

	const tileMeta = () => {
		const meta: Meta = {
			color: '',
			status: ''
		};

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

	const triggerInviteMessage = () => {
		showTextOnDialog('confirm', invite.id);
	};
	const triggerRememberMessage = () => {
		showTextOnDialog('remember', invite.id);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (isOpen && menuOptions && !menuOptions.contains(event.target as Node)) {
			console.log('click outside');
			isOpen = false;
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
		<span class="self-center" class:hidden={invite.remembered && invite.accepted}>
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
			<button
				on:click={triggerInviteMessage}
				class="w-full rounded border border-slate-400 bg-green-200 p-1 text-start text-sm"
				>Confirmar</button
			>
		{/if}
		{#if !invite.remembered && invite.accepted}
			<button
				on:click={triggerRememberMessage}
				class="mb-1 w-full rounded border border-slate-400 bg-blue-200 p-1 text-start text-sm"
				>Lembrar</button
			>
			<button class="w-full rounded border border-slate-400 bg-green-200 p-1 text-start text-sm"
				>Confirmar</button
			>
		{/if}
	</div>
</div>
