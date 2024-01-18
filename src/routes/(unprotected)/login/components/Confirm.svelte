<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../$types';

	export let email: string;
	export let form: ActionData;
</script>

<div class="flex justify-center">
	<div class="mt-24 w-4/5 rounded-md border border-black bg-slate-200 p-5">
		<h1 class="w-full text-center text-3xl">Confirme o código</h1>
		<p class="w-full text-center text-sm">Um código foi enviado para seu email</p>
		<div class="py-4">
			<form action="?/confirm" method="POST" use:enhance>
				<input type="hidden" name="email" bind:value={email} />
				<input
					type="text"
					name="code"
					placeholder="Adicionar código"
					class="mr-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
					value={form?.values?.code ?? ''}
					autocomplete="off"
				/>
				<label for="remember">
					<input type="checkbox" name="remember" id="remember" />Manter conectado</label
				>
				<button class="mt-4 w-full rounded-md bg-blue-500 p-2 text-white">Confimar</button>
			</form>
		</div>
	</div>
</div>
