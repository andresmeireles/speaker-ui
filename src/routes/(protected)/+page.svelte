<script lang="ts">
	/** TODO: André please, refactor this on future to be more clean, i know you are a backend guy, but you can do it! */
	import type { PageData } from './$types';

	export let data: PageData;
	let today = new Date();

	const dateFormatter = (date: Date): string => {
		const dd = String(date.getDate()).padStart(2, '0');
		const mm = String(date.getMonth() + 1).padStart(2, '0');
		const yyyy = date.getFullYear();
		return `${dd}/${mm}/${yyyy}`;
	};

	const jumpToSunday = (date: Date): Date => {
		if (date.getDay() === 0) {
			return date;
		}
		date.setDate(date.getDate() + 1);
		return jumpToSunday(date);
	};

	if (today.getDay() === 0) {
		today.setDate(today.getDate() + 7);
	}

	if (today.getDay() !== 0) {
		today = jumpToSunday(today);
	}

	const displayDate = dateFormatter(today);
	const show =
		data.invites?.filter(
			(i) =>
				i.date.getDate() === today.getDate() &&
				i.date.getMonth() === today.getMonth() &&
				i.date.getFullYear() === today.getFullYear()
		) ?? [];
	const nextWeek = new Date(today.setDate(today.getDate() + 7));
	const displayDateNextWeek = dateFormatter(nextWeek);
	const showOnNextWeek =
		data.invites?.filter(
			(i) =>
				i.date.getDate() === nextWeek.getDate() &&
				i.date.getMonth() === nextWeek.getMonth() &&
				i.date.getFullYear() === nextWeek.getFullYear()
		) ?? [];
</script>

<div>
	<div class="flex flex-col py-6">
		<h1 class="text-3xl">Convites do domingo dia {displayDate}</h1>
		<div class="flex-col justify-start mt-8">
			<table class="w-full">
				<thead class="bg-slate-200">
					<tr>
						<th class="p-2 border border-slate-300">Nome</th>
						<th class="p-2 border border-slate-300">Tema</th>
						<th class="p-2 border border-slate-300">Data / Tempo</th>
						<th class="p-2 border border-slate-300">Aceito</th>
						<th class="p-2 border border-slate-300">Relembrado</th>
					</tr>
				</thead>
				<tbody class="bg-slate-100">
					{#each show as invite}
						<tr>
							<td class="p-3 border border-slate-200">{invite.person.name}</td>
							<td class="p-3 border border-slate-200">{invite.theme}</td>
							<td class="p-3 border border-slate-200 text-center"
								>{dateFormatter(invite.date)} / {invite.time}</td
							>
							<td class="p-3 border border-slate-200">{invite.accepted ? 'Sim' : 'Nao'}</td>
							<td class="p-3 border border-slate-200">{invite.remembered ? 'Sim' : 'Nao'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<div class="flex flex-col py-6 mt-8">
		<h1 class="text-3xl">Convites do proximo domingo dia {displayDateNextWeek}</h1>
		<div class="flex-col justify-start mt-8">
			<table class="w-full">
				<thead class="bg-slate-200">
					<tr>
						<th class="p-2 border border-slate-300">Nome</th>
						<th class="p-2 border border-slate-300">Tema</th>
						<th class="p-2 border border-slate-300">Data / Tempo</th>
						<th class="p-2 border border-slate-300">Aceito</th>
						<th class="p-2 border border-slate-300">Relembrado</th>
					</tr>
				</thead>
				<tbody class="bg-slate-100">
					{#each showOnNextWeek as invite}
						<tr>
							<td class="p-3 border border-slate-200">{invite.person.name}</td>
							<td class="p-3 border border-slate-200">{invite.theme}</td>
							<td class="p-3 border border-slate-200 text-center"
								>{dateFormatter(invite.date)} / {invite.time}</td
							>
							<td class="p-3 border border-slate-200">{invite.accepted ? 'Sim' : 'Nao'}</td>
							<td class="p-3 border border-slate-200">{invite.remembered ? 'Sim' : 'Nao'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
