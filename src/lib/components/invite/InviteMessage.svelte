<script lang="ts">
	import { triggerToastMessage } from '$lib/actions/toast';
	import { onMount, afterUpdate } from 'svelte';

	// external variables
	export let message: string;
	export let openDialog: boolean;

	let dialog: HTMLDialogElement;

	// internal variables
	let modalBodyRef: HTMLDivElement;

	// actions
	const copy = (event: MouseEvent) => {
		event.preventDefault();
		navigator.clipboard.writeText(message);
		close();
		triggerToastMessage('copiado');
	};

	const close = () => {
		openDialog = false;
		dialog.close();
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

	$: if (openDialog) {
		dialog.showModal();
	}
</script>

<dialog bind:this={dialog} class="bg-transparent">
	<div bind:this={modalBodyRef} class="flex flex-col rounded-2xl bg-slate-200 p-3">
		<div class="inline-flex justify-between">
			<h1 class="text-2xl">Convite</h1>
			<button on:click={close} class="rounded-3xl bg-red-400 px-2 py-1">x</button>
		</div>
		<div class="mt-3 rounded-lg border border-black bg-white p-4">
			<div>{@html message.replace(/\n/g, '<br/>')}</div>
		</div>
		<div class="mt-3 inline-flex gap-1">
			<button class="rounded-md bg-blue-500 px-3 py-1 text-white" on:click={copy}>copiar</button>
		</div>
	</div>
</dialog>
