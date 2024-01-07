<script lang="ts">
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
		// jump 7 days
		today.setDate(today.getDate() + 7);
	}

	if (today.getDay() !== 0) {
		today = jumpToSunday(today);
	}

	// format today as dd/mm/YYYY
	const displayDate = dateFormatter(today);

	let show =
		data.invites?.filter(
			(i) =>
				i.date.getDate() === today.getDate() &&
				i.date.getMonth() === today.getMonth() &&
				i.date.getFullYear() === today.getFullYear()
		) ?? [];

	$: show;
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
						<th class="p-2 border border-slate-300">Data/Tempo</th>
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
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
