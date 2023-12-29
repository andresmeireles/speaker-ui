<script lang="ts">
	import InviteForm from './components/InviteModal.svelte';

	let showModal = false;
	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<dialog class="w-5/6 rounded-md" bind:this={dialog} on:close={() => (showModal = false)}>
	<InviteForm submitter={(name, time, theme, date) => dialog.close()} {dialog} />
</dialog>

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
				<tr>
					<td class="text-center border border-slate-200 p-3">Jose</td>
					<td class="text-center border border-slate-200 p-3">Super tema</td>
					<td class="text-center border border-slate-200 p-3">2022-01-01/5min</td>
					<td class="text-center border border-slate-200 p-3"></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
