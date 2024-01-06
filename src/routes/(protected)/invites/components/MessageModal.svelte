<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';

	// external variables
	export let dialog: HTMLDialogElement;
	export let message: string;
	export let openDialog: boolean;
	export let inviteId: number;
	export let isInvite: boolean;

	// internal variables
	let modalBodyRef: HTMLDivElement;
	let formRef: HTMLFormElement;

	// close event
	const dispatch = createEventDispatcher();

	// actions
	const copy = (event: MouseEvent) => {
		event.preventDefault();
		navigator.clipboard.writeText(message);
		close();
		toast.push('copiado');
	};

	const close = () => {
		openDialog = false;
		dispatch('close');
	};

	// detect outside click
	const handleClick = (event: MouseEvent) => {
		if (!modalBodyRef.contains(event.target as Node)) {
			close();
		}
	};

	onMount(() => {
		dialog.addEventListener('click', handleClick);
	});

	afterUpdate(() => {
		dialog.addEventListener('click', handleClick);
	});

	const submitEvent = (event: Event) => {
		event.preventDefault();
		const canSubmit = confirm(`Deseja confirmar como ${isInvite ? 'convidado' : 'relembrado'}?`);

		if (!canSubmit) return;

		formRef.submit();
	};

	$: if (openDialog) dialog.showModal();
	$: if (!openDialog && dialog !== undefined) dialog.close();
	$: dispatch('close');
</script>

<dialog bind:this={dialog} class="bg-transparent">
	<div bind:this={modalBodyRef} class="flex flex-col p-3 bg-slate-200 rounded-2xl">
		<div class="justify-between inline-flex">
			<h1 class="text-2xl">Convite</h1>
			<button on:click={close} class="rounded-3xl bg-red-400 px-2 py-1">x</button>
		</div>
		<div class="bg-white p-4 rounded-lg border border-black mt-3">
			<div>{@html message.replace(/\n/g, '<br/>')}</div>
		</div>
		<div class="inline-flex gap-1 mt-3">
			<button class="bg-blue-500 rounded-md text-white py-1 px-3" on:click={copy}>copiar</button>
			<form bind:this={formRef} method="post" action="?/trigger">
				<input type="hidden" name="id" value={inviteId} />
				<input type="hidden" name="isInvite" value={isInvite} />
				{#if isInvite}
					<button on:click={submitEvent} class="bg-green-500 rounded-md text-white py-1 px-3"
						>confirmar</button
					>
				{:else}
					<button on:click={submitEvent} class="bg-green-500 rounded-md text-white py-1 px-3"
						>relembrar</button
					>
				{/if}
			</form>
		</div>
	</div>
</dialog>
