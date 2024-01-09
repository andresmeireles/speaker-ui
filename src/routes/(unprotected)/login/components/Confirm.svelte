<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../$types';

	export let email: string;
	export let form: ActionData;
</script>

<div class="flex justify-center">
	<div class="bg-slate-200 w-4/5 p-5 rounded-md mt-24 border-black border">
		<h1 class="text-3xl w-full text-center">Confirme o código</h1>
		<p class="w-full text-center text-sm">Um código foi enviado para seu email</p>
		<div class="py-4">
			<form action="?/confirm" method="POST" use:enhance>
				<input type="hidden" name="email" bind:value={email} />
				<input
					type="text"
					name="code"
					placeholder="Adicionar código"
					class="w-full p-2 mr-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					value={form?.values?.code ?? ''}
					autocomplete="off"
				/>
				<label for="stay_connected">
					<input type="checkbox" name="stay_connected" id="stay_connected" />Manter conectado</label
				>
				<button class="rounded-md bg-blue-500 text-white p-2 mt-4 w-full">Confimar</button>
			</form>
		</div>
	</div>
</div>
