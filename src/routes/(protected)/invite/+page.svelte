<script lang="ts">
	import type { Person } from '$lib';
	import type { ActionData, PageData } from './$types';
	import InviteForm from './components/InviteForm.svelte';

	export let data: PageData;
	export let form: ActionData;

	const people = data.people ?? [];
	const id = Number(data.id ?? 0);
	const invite = {
		id: 0,
		date: new Date(),
		person: people.find((p) => p.id === id) as Person,
		theme: '',
		time: 5,
		references: '',
		accepted: false,
		remembered: false
	};
</script>

<InviteForm {people} {form} {invite} />
