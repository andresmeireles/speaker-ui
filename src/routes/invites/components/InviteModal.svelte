<script lang="ts">
	export let submitter: (name: string, time: number, theme: string, date: Date) => void;
	export let dialog: HTMLDialogElement;

	let name = '',
		date = new Date(),
		theme = '',
		time = 0,
		references = '';

	const handleSubmit = () => {
		submitter(name, time, theme, date);
	};

	$: name, date, theme, time;
</script>

<div class="flex justify-center">
	<div class="w-full p-4 bg-gray-100 rounded-lg">
		<div class="flex py-2 justify-between">
			<div class="text-2xl">Criar novo convite</div>
			<svg
				role="button"
				tabindex="0"
				on:click={() => dialog.close()}
				on:keydown={(e) => e.key === 'Escape' && dialog.close()}
				xmlns="http://www.w3.org/2000/svg"
				class="w-[3%] h-[3%] cursor-pointer"
				viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"
				/></svg
			>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="name"> Nome: </label>
			<!-- TODO: Create a select with input -->
			<input
				class="shadow appearance-none border border-slate-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="name"
				type="text"
				placeholder="Nome do orador"
				on:input={(e) => (name = e.currentTarget.value)}
			/>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="theme"> Tema: </label>
			<input
				class="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="theme"
				type="text"
				placeholder="Tema do discurso"
				on:input={(e) => (theme = e.currentTarget.value)}
			/>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="time"> Tempo: </label>
			<select
				class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				on:select={(e) => (time = Number(e.currentTarget.value))}
			>
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="15">15</option>
			</select>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="date"> Data: </label>
			<input
				class="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="date"
				type="text"
				placeholder="Data do discurso"
				on:input={(e) => (theme = e.currentTarget.value)}
			/>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="references">
				Referencias:
			</label>
			<textarea
				name="references"
				class="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				rows="5"
				id="references"
				placeholder="Referencias de discursos ou escrituras"
				on:input={(e) => (references = e.currentTarget.value)}>{references}</textarea
			>
		</div>
		<div class="flex justify-end">
			<button
				on:click={handleSubmit}
				class="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			>
				Submit
			</button>
		</div>
	</div>
</div>
