<script lang="ts">
	import type { ApiInvite, Invite } from '$lib';
	import { afterUpdate, onMount } from 'svelte';
	import CloseIcon from '../icons/CloseIcon.svelte';

	export let show: boolean;
	export let invite: Invite | ApiInvite;
	let dialog: HTMLDialogElement;

	const handleOutsideClick = (event: MouseEvent) => {
		if (event.target === dialog) {
			show = false;
		}
	};

	afterUpdate(() => {
		if (dialog.open) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	});

	$: if (!show && dialog) {
		dialog.close();
	}
	$: if (show && dialog) {
		dialog.showModal();
	}
</script>

<dialog bind:this={dialog} class="w-10/12 rounded">
	<div class="flex flex-col rounded p-3">
		<div class="flex justify-end">
			<button on:click={() => (show = false)} class="text-red-500">
				<CloseIcon size={1.5} />
			</button>
		</div>
		<div class="py-4">O discurso foi feito?</div>
		<div class="flex justify-end gap-3">
			<form action="/invite?/done" method="POST">
				<input type="hidden" name="id" value={invite.id} />
				<input type="hidden" name="was-done" value={true} />
				<button class="rounded bg-green-500 px-3 py-1 font-bold text-white">Sim</button>
			</form>
			<form action="/invite?/done" method="POST">
				<input type="hidden" name="id" value={invite.id} />
				<input type="hidden" name="was-done" value={false} />
				<button class="rounded bg-red-500 px-3 py-1 font-bold text-white">Não</button>
			</form>
		</div>
	</div>
</dialog>
