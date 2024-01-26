<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const formatDate = (date: string): string => {
		const d = new Date(date);
		const day = String(d.getDate()).padStart(2, '0');
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const year = d.getFullYear();

		return `${day}/${month}/${year}`;
	};

	const status = (status: number): string => {
		switch (status) {
			case 1:
			case 3:
				return 'confirmado';
			case 2:
				return 'rejeitado';
			case 4:
				return 'lembrado';
			case 5:
				return 'feito';
			default:
				return 'nao feito';
		}
	};
</script>

<h1 class="text-3xl">Estatísticas de {data.speaker.name}</h1>
<div class="mt-8 space-y-2">
	{#each data.invites as invite}
		<div class="rounded bg-amber-600 p-2 text-xl text-white md:flex">
			<div class="md: w-3/4">
				<p><span class="font-bold">Data:</span> {formatDate(invite.date)}</p>
				<p><span class="font-bold">Tema:</span> {invite.theme}</p>
				<p><span class="font-bold">Duração:</span> {invite.time} minutos</p>
			</div>
			<div>
				<p><span class="font-bold">Status:</span> {status(invite.status)}</p>
			</div>
		</div>
	{/each}
</div>
