<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import InviteForm from './components/InviteForm.svelte';

	export let data: PageData;
	export let form: ActionData;

	const people = data.people ?? [];
</script>

<InviteForm {people} {form} />
