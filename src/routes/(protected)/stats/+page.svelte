<script lang="ts">
	import { triggerToastError, type Stats } from '$lib';
	import type { PageData } from './$types';

	export let data: PageData;

	const year = new Date().getFullYear();

	if (data.error) {
		triggerToastError('error fetching stats');
	}
</script>

<div>
	<div class="flex items-center justify-between py-6">
		<h1 class="text-3xl">Estatísticas</h1>
	</div>
	<div class="space-y-2 p-3">
		{#each data.stats as stat}
			<div class="flex justify-between gap-2 rounded bg-green-200 p-4">
				<div class="flex flex-[8] justify-between self-center">
					<span>{stat.speaker.name}</span>
					<div class="flex gap-1">
						<div>
							<span>Realizados em {year}:</span>
							<span class="font-bold">{stat.doneSpeaks}</span>
						</div>
						<span>|</span>
						<div>
							<span>Convites em {year}:</span>
							<span class="font-bold">{stat.totalSpeaks}</span>
						</div>
					</div>
				</div>
				<div class="flex-[2] text-center">
					<a
						href="/stats/{stat.speaker.id}"
						class=" rounded border border-slate-600 p-2 hover:bg-green-300">Lista de discursos</a
					>
				</div>
			</div>
		{/each}
	</div>
</div>
