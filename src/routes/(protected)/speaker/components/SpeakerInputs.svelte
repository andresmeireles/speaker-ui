<script lang="ts">
	import type { ActionData } from '../$types';

	export let form: ActionData;
	export let hasError: boolean;
	export let errorMessage: string;
	export let id: number | null = null;
</script>

<div class="flex flex-col space-y-2">
	{#if id !== null}
		<input type="hidden" name="id" value={id} />
	{/if}
	<div class="flex flex-col">
		<label for="name">Nome</label>
		<input
			id="name"
			type="text"
			class="rounded border-slate-300 text-slate-600"
			name="name"
			placeholder="Primeiro nome"
			value={form?.speaker ?? ''}
			required
		/>
		{#if hasError}
			<small class="text-red-500">{errorMessage}</small>
		{/if}
	</div>
	<div class="flex flex-col">
		<label for="lastname">Sobrenome</label>
		<input
			type="text"
			class="rounded border-slate-300 text-slate-600"
			name="lastname"
			id="lastname"
			placeholder="Sobrenome nome"
		/>
	</div>
	<div class="flex flex-col">
		<label for="gender">Genero</label>
		<select required name="gender" class="rounded border-slate-300 text-slate-600" id="gender">
			<option value="M" selected>Masculino</option>
			<option value="F">Feminino</option>
		</select>
	</div>
</div>
